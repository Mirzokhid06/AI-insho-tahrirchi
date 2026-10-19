# Insho va Matn Tahrirchisi (AI Writing Coach)

Insho va badiiy matnlar, hikoyalar hamda blog postlarni ta'limiy va do'stona ohangda tahlil qiluvchi, real vaqtda bir bosqichli intellektual qayta yozish va uslubiy tavsiyalar taqdim etuvchi zamonaviy veb-ilova. Telefon uchun moslashtirilgan qulay ergonomika, to'liq qorong'u rejim (Dark Mode) va avtomatik moslashuvchi Gemini harorat (temperature) sozlamalariga ega.

## User Review & Critical Decisions

> [!IMPORTANT]
> Foydalanuvchi bilan Phase 1 da kelishilgan asosiy yo'nalishlar va arxitektura tanlovlari:

- **Ixtisoslashuv**: Badiiy asarlar, hikoyalar, emotsional insholar va blog postlar (ijodiy matnlar uchun boy metafora, badiiy tasviriy vositalar va jonli ritm).
- **Tahrir uslubi**: Tezkor bir bosqichli qayta yozish va avtomatik yaxshilash (One-click Smart Rewrite) bilan birga ustozona do'stona izohlar ("Nimalar o'zgartirildi va nima uchun?").
- **AI Harorati & Tizim Ko'rsatmalari (Temperature & System Instructions)**: Janr va maqsadga qarab intellektual avtomatik parametrlar:
  - *Badiiy hikoya / Ijodiy insho*: Harorat `0.85` — boy tasvirlar, his-tuyg'u, obrazlilik.
  - *Ta'sirchan blog post*: Harorat `0.70` — qiziqarli kirish, kuchli ritm, o'quvchini jalb qilish.
  - *Falsafiy & chuqur tahliliy insho*: Harorat `0.55` — fikriy ketma-ketlik, mantiqiy ravonlik.
  - *Do'stona murabbiy ohangi*: Tizim ko'rsatmalarida doimo samimiy, rag'batlantiruvchi va o'rgatuvchi uslub.
- **Interfeys va Ergonomika**: Telefon uchun maxsus optimallashtirilgan pastki boshqaruv paneli (Bottom Action Sheet / Sticky Bar), 44px+ sensorli tugmalar, yonma-yon solishtirish (Diff View) va ko'zni toliqtirmaydigan qorong'u rejim.

---

## 1. Overview & Core Concept

### What It Does
"Insho va Matn Tahrirchisi" — bu mualliflar, talabalar va blogerlarga o'zbek tilidagi (hamda ko'p tilli) matnlarini yangi bosqichga olib chiqishga yordam beradigan intellektual yozuv murabbiyi. Ilova shunchaki xatolarni to'g'rilabgina qolmay, matnning emotsional ta'sirini, jumlalar tuzilishini va so'z boyligini boyitadi, o'zgarishlar sababini do'stona tushuntirib beradi.

### Target Audience & Persona
- **Badiiy asar va hikoya yozuvchilar**: Obrazlarni jonlantirish, o'xshatish va metaforalarni kuchaytirish uchun.
- **Talabalar va abituriyentlar**: Insho va esse yozishda ravonlik, kirish va xulosa qismlarini mukammallashtirish uchun.
- **Blogerlar va kontent yaratuvchilar**: Matn ritmini oshirish, o'quvchi diqqatini ushlab turish va ta'sirchan sarlovhalar yaratish uchun.

### Key Value
- **Bir bosqichda yaxshilash**: Matnni kiritib bitta tugma orqali to'liq sayqallangan variantni olish.
- **Avvalgi va yangi variantni solishtirish (Side-by-side & Diff highlight)**: Matndagi har bir o'zgarishni ko'rib chiqish va bir klik bilan qabul qilish yoki qaytarish.
- **Do'stona murabbiy maslahatlari**: Qaysi so'zlar takrorlangan, qaysi jumlalarni qisqartirish yoki his-tuyg'u bilan boyitish mumkinligi haqida samimiy yo'l-yo'riq.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Boshlash & Matn Kiritish**: Foydalanuvchi o'z inshosi, hikoyasi yoki blog qoralamasini qulay muharrirga yozadi yoki namunaviy mavzulardan birini tanlaydi. Real vaqtda so'zlar soni, belgilar va o'qish vaqti ko'rsatiladi.
2. **Janr & Intellektual Rejimni Tanlash**: Foydalanuvchi matn turini belgilaydi (Badiiy hikoya, Ta'sirchan blog, Falsafiy insho, Kuchli sarlavha). Tizim avtomatik ravishda optimal `temperature` va pedagogik `systemInstruction`larni sozlaydi.
3. **Bir Bosqichli Tahrir (Smart Rewrite)**: "Matnni Mukammallashtirish" tugmasi bosilganda serverdagi Gemini API orqali yaxshilangan matn va do'stona murabbiy tahlili shakllanadi.
4. **Solishtirish & O'rganish**: Foydalanuvchi "Avvalgi" va "Mukammal" ko'rinishlarni yonma-yon yoki tab orqali ko'radi; murabbiyning "Nimalarni yaxshiladik" bo'limidagi tavsiyalarini o'rganadi.
5. **Nusxa Olish & Qoralama Saqlash**: Yaxshilangan matnni nusxalash, saqlab qo'yish yoki yangi matn ustida ishlash.

### Visual Identity & Theme
- **Aesthetic Direction**: Zamonaviy ijodiy studiya va kitob nashriyoti estetikasi — qulay, e'tiborni bo'lmaydigan, toza va professional.
- **Color Palette**:
  - *Light Mode*: Yumshoq fon (`#F8FAFC`), matn yuzasi (`#FFFFFF`), nozik chegaralar (`#E2E8F0`), asosiy aksent chuqur indigo-binafsha (`#4F46E5`) va iliq kehribar oltin (`#D97706`).
  - *Dark Mode*: Tungi osmon va grafit qorasi (`#0B0F17` fon, `#161E2E` panellar), yorug' matn (`#F1F5F9`), kontrastli aksentlar (`#818CF8`).
- **Typography**:
  - Sarlavhalar va brend: `Plus Jakarta Sans` / `Outfit` (aniq, do'stona va zamonaviy).
  - Matn tanasi va insho o'qish maydoni: 16px, balandligi 1.7, kengligi qulay ko'rish uchun mo'ljallangan.
  - Statistikalar va ko'rsatkichlar: `tabular-nums` bilan harflar tekislangan.
- **Zero-Pill Discipline**:
  - Hech qanday keraksiz tabletka-badjlar yoki rang-barang konfet shaklidagi yorliqlar yo'q; metama'lumotlar toza matn va `·` ajratgichlar bilan beriladi.
  - Interaktiv filtrlar va rejimlar aniq bosiladigan tugmalar (segmented controls) ko'rinishida bo'ladi.

### Mobile & Touch Optimization (references/10_mobile_touch_apps.md)
- Barcha sensorli elementlar $\ge 44\text{px}$ hitboxga ega.
- Mobilda qulay boshqaruv uchun pastki fiksatsiyalangan harakat paneli (Sticky Action Bar).
- Mobilda vertikal tablar orqali oson almashtirish, planshet va kompyuterda esa yonma-yon (Split View) keng qamrovli muharrir.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Server-Side Gemini API Integratsiyasi
- **Yondashuv**: Barcha Gemini chaqiruvlari Node/Express server marshruti (`/api/coach/rewrite`) orqali xavfsiz boshqariladi. Model: `gemini-3.8-flash`.
- **Sabab**: API kalit xavfsizligi, tizim ko'rsatmalari (`systemInstruction`) va harorat parametrlarini markazlashgan boshqarish, tezkor va barqaror javob qaytarish.
- **Muqobillar**: Brauzerdan to'g'ridan-to'g'ri chaqirish (xavfsizlik talablariga zid, kalit brauzerga chiqib ketishi xavfi bor).

### Decision 2: Tezkor Bir Bosqichli Qayta Yozish + Tushuntirishli Strukturaviy JSON
- **Yondashuv**: Gemini modeliga tizimli JSON schema orqali so'rov yuboriladi:
  - `improvedText`: Qayta yozilgan, boyitilgan va to'liq sayqallangan matn.
  - `coachingNotes`: Murabbiyning do'stona xulosasi (qanday uslubiy yutuqlarga erishildi).
  - `enhancements`: Asosiy o'zgarishlar ro'yxati (so'z boyligi, tasviriy vositalar, jumla ritmi).
  - `readabilityMetrics`: O'qilishi, hissiy ta'siri va uslubiy darajasi haqida tavsiyalar.
- **Sabab**: Foydalanuvchi faqat yangi matnni olibgina qolmay, nima sababdan bu matn kuchliroq bo'lganini bilib, o'z yozish mahoratini oshiradi.

### Decision 3: Avtomatik Intellektual Parametrlar (Smart Auto-Presets)
- **Yondashuv**: Har bir janr rejimi (Hikoya, Blog, Esse) o'ziga xos optimal harorat va ko'rsatmaga ega, ammo foydalanuvchi xohlasa "Murabbiy Sozlamalari" modalida erkin harorat slayderini ham ko'rishi mumkin.
- **Sabab**: Qulaylik va soddalik — foydalanuvchi murakkab promptlar yozmasdan, bitta janrni tanlab mukammal natija oladi.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       BRAUZER (Frontend)                    │
│                                                             │
│  ┌────────────────────┐   ┌──────────────────────────────┐  │
│  │   Top App Header   │   │  Theme Toggle (Dark/Light)   │  │
│  └────────────────────┘   └──────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Janr & Uslub Tanlagich (Badiiy, Hikoya, Blog, Esse)  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────┬───────────────────────────┐  │
│  │     Matn Muharriri        │     Natija & Solishtirish │  │
│  │  - Matn kiritish          │  - Mukammallashtirilgan   │  │
│  │  - Namunaviy matnlar      │  - Yonma-yon Diff         │  │
│  │  - So'z / belgi hisobi    │  - Murabbiy maslahatlari  │  │
│  └───────────────────────────┴───────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Mobile Sticky Action Bar / "Mukammallashtirish"      │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ POST /api/coach/rewrite
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NODE.JS / EXPRESS SERVER                 │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Coach Controller:                                    │  │
│  │  - Rejimga mos Temperature va System Instructions     │  │
│  │  - @google/genai SDK (gemini-3.8-flash)               │  │
│  │  - JSON Schema asosida strukturalashgan javob         │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ API Call (GEMINI_API_KEY)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     GEMINI AI (Google)                      │
│             Model: gemini-3.8-flash (Reasoning/Text)        │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy & Handlers
- `App.tsx`: Ilovaning asosiy holat markazi (mode, theme, text, improvedResult, loading, history).
- `Header.tsx`: 3-zonali toza Top Bar (brend nomi, rejim ma'lumotlari, dark mode tugmasi).
- `GenreSelector.tsx`: Badiiy asarlar, hikoyalar, ta'sirchan blog va insholar uchun bir klikli intellektual parametrlar.
- `EditorWorkspace.tsx`: Matn kiritish maydoni, hisoblagichlar, namuna matn yuklash (Preset Samples) va tozalash tugmalari.
- `ResultComparisonView.tsx`: Mukammal matn ko'rinishi, "Avvalgi vs Yangi" solishtirish, nusxa olish va murabbiy tahlili bloklari.
- `CoachTipsCard.tsx`: Do'stona murabbiyning pedagogik tavsiyalari va yaxshilangan jihatlari.
- `HistoryDrawer.tsx`: Avvalgi tahrirlar tarixini ko'rish va qayta yuklash.

---

## 5. Verification & Implementation Steps

1. **Server API**: Express serverda `@google/genai` orqali `/api/coach/rewrite` endpointini yaratish; `gemini-3.8-flash` modelidan tizimli JSON olishni yo'lga qo'yish.
2. **Metadata & HTML**: `metadata.json` va `index.html` ni O'zbekcha "Insho va Matn Tahrirchisi (AI Writing Coach)" nomiga yangilash.
3. **Frontend UI**:
   - Qorong'u rejim va yorug' rejim to'liq qo'llab-quvvatlanishi.
   - Badiiy hikoya, emotsional insho va blog post namunaviy matnlarini kiritish.
   - Mobil va planshet/desktop uchun qulay responsive muharrir.
   - Yonma-yon diff va bir klikli tezkor tahrir.
4. **Build & Tekshiruv**: `compile_applet` orqali xatoliksiz kompilyatsiyani tasdiqlash.
