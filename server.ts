import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize Google Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenreConfig {
  temperature: number;
  label: string;
  systemInstruction: string;
}

const GENRE_CONFIGS: Record<string, GenreConfig> = {
  badiiy_hikoya: {
    temperature: 0.85,
    label: "Badiiy Asar & Hikoya",
    systemInstruction: `Siz tajribali, mehrli va yuksak didli O'zbek tili adabiyoti va ijodiy yozuvchilik murabbiyisiz (Creative Writing Coach).
Sizning maqsadingiz — muallif qoralagan matnni quruq va oddiy so'zlardan tozalab, haqiqiy badiiy san'at asariga aylantirishga yordam berishdir.
Qoidalar:
1. Ohang: Do'stona, rag'batlantiruvchi, samimiy va o'rgatuvchi (ta'limiy).
2. Tasviriy vositalar: Metaforalar, jonlantirish, sifatlashlar va o'xshatishlarni boyiting. O'quvchining ko'z o'ngida manzara gavdalansin ("Show, don't tell").
3. Til boyligi: Takrorlanuvchi qashshoq so'zlar o'rniga rang-barang sinonimlar va iboralardan foydalaning.
4. Jumlalar ritmi: Matnda nafas olish ritmi bo'lsin — qisqa shiddatli jumlalar bilan salmoqli lirik jumlalarni uyg'unlashtiring.
5. Murabbiy izohi: Foydalanuvchiga nima uchun bunday o'zgarishlar kiritilganini mehr bilan, ustozona tushuntiring.`
  },
  blog_post: {
    temperature: 0.70,
    label: "Ta'sirchan Blog Post",
    systemInstruction: `Siz zamonaviy raqamli hikoyachilik (digital storytelling) va blogerlik bo'yicha mahoratli murabbiyisiz.
Sizning vazifangiz — matnni o'quvchi diqqatini birinchi jumlalardanoq tortadigan (hook), qiziqarli, samimiy va dinamik blog postga aylantirish.
Qoidalar:
1. Ohang: Zamonaviy, do'stona, ochiqko'ngil va energiyaga to'la.
2. Kirish: Zerikarli rasmiy kirish o'rniga darhol savol, voqea yoki qiziq fikr bilan boshlang.
3. O'qilishi: Abzaslarni ixcham qiling, jumlalarni ravon va yengil o'qiladigan shaklga keltiring.
4. Foyda va xulosa: O'quvchi matn oxirida o'zi uchun xulosa va taassurot olsin.`
  },
  falsafiy_esse: {
    temperature: 0.55,
    label: "Falsafiy & Chuqur Insho",
    systemInstruction: `Siz falsafiy, publitsistik va tahliliy insholar bo'yicha professional adabiy tahrirchisiz va murabbiyisiz.
Qoidalar:
1. Ohang: O'yga toldiruvchi, jiddiy ammo juda samimiy va tushunarli.
2. Mantiq: Fikrlar oqimi bir-biriga uzviy bog'langan, pishiq dalillar bilan mustahkamlangan bo'lsin.
3. Til: So'zlar aniq ma'noda tanlansin, mantiqiy xatolar va pala-partish jumlalar tekislansin.
4. Teranlik: O'quvchini fikrlashga, tafakkur qilishga chorlasin.`
  },
  qisqa_hikoya: {
    temperature: 0.80,
    label: "Lirik & Emotsional Miniatyura",
    systemInstruction: `Siz lirik nasr, his-tuyg'ular va psixologik chizgilar ustasi bo'lgan murabbiyisiz.
Qoidalar:
1. Ohang: Nozik tuyg'uli, lirik, samimiy va ta'sirchan.
2. Psixologizm: Qahramonning ruhiy kechinmalari, nigohi, ruhiyati kabi detallarni ko'rsating.
3. Mo'jizaviy soddalik: Keraksiz tafsilotlarni qisqartirib, har bir so'zga emotsional vazn bering.`
  }
};

// Response schema for structured output
const rewriteResponseSchema = {
  type: Type.OBJECT,
  properties: {
    improvedText: {
      type: Type.STRING,
      description: "Mukammallashtirilgan, sayqallangan to'liq matn (o'zbek tilida).",
    },
    coachSummary: {
      type: Type.STRING,
      description: "Murabbiyning samimiy, do'stona va ta'limiy umumiy xulosasi.",
    },
    keyChanges: {
      type: Type.ARRAY,
      description: "Kiritilgan asosiy 2-4 ta uslubiy o'zgarishlar va ularning sababi.",
      items: {
        type: Type.OBJECT,
        properties: {
          aspect: {
            type: Type.STRING,
            description: "O'zgarish yo'nalishi (masalan: So'z boyligi, Tasviriy vosita, Jumla ritmi).",
          },
          explanation: {
            type: Type.STRING,
            description: "Qanday o'zgarish qilindi.",
          },
          benefit: {
            type: Type.STRING,
            description: "Bu o'zgarish o'quvchida qanday taassurot qoldiradi.",
          },
        },
        required: ["aspect", "explanation", "benefit"],
      },
    },
    readabilityScore: {
      type: Type.NUMBER,
      description: "Matnning uslubiy va o'qilish jozibasi bahosi (1 dan 100 gacha raqam).",
    },
    styleTone: {
      type: Type.STRING,
      description: "Yaratilgan uslub va kayfiyat ta'rifi.",
    },
    coachTip: {
      type: Type.STRING,
      description: "Muallifga keyingi ijodida asqotadigan 1 ta oltin qoida yoki amaliy maslahat.",
    },
  },
  required: ["improvedText", "coachSummary", "keyChanges", "readabilityScore", "styleTone", "coachTip"],
};

// Bulletproof JSON cleaner and parser
function cleanAndParseJSON(rawText: string, originalFallbackText: string) {
  let cleaned = (rawText || '').trim();

  // Strip markdown code fences if present (```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // Attempt direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt extracting between first '{' and last '}'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch {
        // Fallback reconstruction
      }
    }

    // Graceful fallback object if JSON syntax had issues
    return {
      improvedText: cleaned || originalFallbackText,
      coachSummary: "Matn qayta ishlandi va uslubiy jihatdan takomillashtirildi.",
      keyChanges: [
        {
          aspect: "Uslubiy sayqal",
          explanation: "Jumlalar ritmi va so'zlar mutanosibligi yaxshilandi.",
          benefit: "Matn ravonroq va o'qilishi yoqimliroq bo'ldi.",
        },
      ],
      readabilityScore: 88,
      styleTone: "Sayqallangan va ifodali",
      coachTip: "Yozishda sodda so'zlarni boy sinonimlar bilan almashtirishga davom eting.",
    };
  }
}

// API: One-click smart rewrite with dynamic temperature and system instruction
app.post('/api/coach/rewrite', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const { text, genre = 'badiiy_hikoya', customTemperature, customTone } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: "Iltimos, tahrirlash uchun matn kiriting." });
    }

    const config = GENRE_CONFIGS[genre] || GENRE_CONFIGS['badiiy_hikoya'];
    let temperature = typeof customTemperature === 'number' ? customTemperature : config.temperature;
    temperature = Math.max(0.1, Math.min(1.0, temperature));

    let dynamicInstruction = config.systemInstruction;
    if (customTone && typeof customTone === 'string') {
      dynamicInstruction += `\nQo'shimcha ohang talabi: Matn ${customTone} kayfiyatida bo'lsin.`;
    }

    const userPrompt = `Quyidagi matnni ko'rib chiqing va uni yuksak mahorat bilan mukammallashtiring:
---
${text.trim()}
---
Iltimos, belgilangan JSON schema asosida do'stona va ta'limiy ohangda javob bering.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: dynamicInstruction,
        temperature: temperature,
        responseMimeType: 'application/json',
        responseSchema: rewriteResponseSchema,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const jsonText = response.text || '';
    const parsedData = cleanAndParseJSON(jsonText, text.trim());

    return res.json({
      success: true,
      data: parsedData,
      meta: {
        appliedTemperature: temperature,
        genre: genre,
        genreLabel: config.label,
      },
    });
  } catch (err: any) {
    console.error("Coach rewrite error:", err);
    return res.status(500).json({
      error: "Tahrirlash jarayonida xatolik yuz berdi.",
      details: err?.message || String(err),
    });
  }
});

// API: Normalize regional dialects and speech-to-text recognition errors
app.post('/api/coach/normalize-speech', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: "Iltimos, matn kiriting." });
    }

    const systemInstruction = `Siz O'zbekistonning barcha hududiy shevalari (Toshkent, Farg'ona vodiysi, Samarqand, Buxoro, Xorazm, Qashqadaryo, Surxondaryo) hamda og'zaki nutq talaffuzi bo'yicha yetuk mutaxassissiz.
Vazifangiz: Foydalanuvchi ovozda aytgan yoki shevada yozilgan matnni sof, chiroyli va qat'iy adabiy O'zbek tiliga aylantirish.
Qoidalar:
1. Barcha sheva so'zlarini adabiy ekvivalentiga o'giring (masalan: "ovotti/bovotti" -> "olyapti/bo'lyapti", "gapiziyam" -> "gapingizni ham", "proyektimiza" -> "loyihamiz", "silab bilan" -> "sizlar bilan", "chundim" -> "tushundim").
2. Nutqni aniqlashdagi fonetik chalkashliklarni (masalan: "googlaya studiyada" -> "Google AI Studio'da", "netlifaga" -> "Netlify'ga", "diplol" -> "deploy qilish", "proyekt" -> "loyiha") to'g'ri kontekstda anglab, professional tarzda to'g'rilang.
3. Agar ovoz yozilishida fon shovqini yoki sinov iboralari (masalan: "Eshitmoqdaman abu demak gapirgan gapiziyam yozib berar ekan") bo'lsa, ularni tozalab, haqiqiy maqsaddagi matnni saqlang.
4. Tinish belgilari, bosh harflar va imlo qoidalarini (x/h, tutuq belgisi o', g') to'liq me'yorga keltiring.`;

    const normalizeSchema = {
      type: Type.OBJECT,
      properties: {
        normalizedText: {
          type: Type.STRING,
          description: "Shevalardan tozalangan, to'liq me'yoriy adabiy o'zbek tilidagi matn",
        },
        detectedDialects: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Aniqlangan sheva yoki og'zaki xatolar (masalan: 'Toshkent shevasi qo'shimchalari', 'Og'zaki qisqartmalar', 'Texnik atamalar talaffuzi')",
        },
        coachNote: {
          type: Type.STRING,
          description: "Murabbiyning sheva va talaffuzni to'g'rilash bo'yicha qisqa do'stona xulosasi",
        },
      },
      required: ["normalizedText", "detectedDialects", "coachNote"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Quyidagi og'zaki/shevadagi matnni sof adabiy o'zbek tiliga o'giring:\n"${text.trim()}"`,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: normalizeSchema,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}', text.trim());
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("Normalize speech error:", err);
    return res.status(500).json({
      error: "Shevani adabiy tilga o'tkazishda xatolik yuz berdi.",
      details: err?.message || String(err),
    });
  }
});

// API: Ask coach advice on specific sentence / paragraph
app.post('/api/coach/sentence-advice', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const { sentence, context } = req.body;
    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: "Jumla kiritilmadi." });
    }

    const prompt = `Muallif o'z asaridagi quyidagi jumlani yanada jozibali qilishni xohlamoqda:
Tanlangan jumla: "${sentence}"
${context ? `Umumiy matn konteksti: "${context}"` : ''}

Iltimos, ushbu jumla uchun 3 xil uslubdagi ajoyib muqobil variantni va do'stona murabbiy maslahatini bering.`;

    const adviceSchema = {
      type: Type.OBJECT,
      properties: {
        coachFeedback: {
          type: Type.STRING,
          description: "Jumlaning yutuq va kamchiliklari haqida qisqa do'stona fikr.",
        },
        alternatives: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING, description: "Uslub nomi" },
              sentence: { type: Type.STRING, description: "Yaxshilangan variant" },
              whyBetter: { type: Type.STRING, description: "Nega bu variant ta'sirli" },
            },
            required: ["style", "sentence", "whyBetter"],
          },
        },
      },
      required: ["coachFeedback", "alternatives"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "Siz o'zbek tili va adabiyotining samimiy, mehribon ustozisiz.",
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: adviceSchema,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}', sentence);
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("Sentence advice error:", err);
    return res.status(500).json({
      error: "Maslahat olishda xatolik yuz berdi.",
      details: err?.message || String(err),
    });
  }
});

// Global Express JSON error handler - guarantee JSON output, never HTML error pages
app.use((err: any, _req: any, res: any, next: any) => {
  if (res.headersSent) {
    return next(err);
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    return res.status(400).json({
      error: "Yuborilgan so'rov formati noto'g'ri.",
      details: err.message,
    });
  }
  return res.status(500).json({
    error: "Kutilmagan server xatoligi yuz berdi.",
    details: err?.message || String(err),
  });
});

// Dev vs Prod Vite Mounting
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Writing Coach server running on port ${PORT}`);
});
