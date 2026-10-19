import { SpellingIssue } from '../types.ts';

// Comprehensive dictionary of common Uzbek spelling confusions (x vs h, tutuq belgisi, colloquial forms)
const COMMON_UZBEK_CORRECTIONS: Record<string, { correct: string; reason: string }> = {
  // X vs H confusions
  'xarakat': { correct: 'harakat', reason: "'h' harfi bilan yoziladi (harakat)" },
  'harakatlar': { correct: 'harakatlar', reason: "'h' harfi bilan yoziladi" },
  'hursand': { correct: 'xursand', reason: "'x' harfi bilan yoziladi (xursand)" },
  'hursandchilik': { correct: 'xursandchilik', reason: "'x' harfi bilan yoziladi" },
  'mashxur': { correct: 'mashhur', reason: "'h' harfi bilan yoziladi (mashhur)" },
  'raxmat': { correct: 'rahmat', reason: "'h' harfi bilan yoziladi (rahmat)" },
  'shaxar': { correct: 'shahar', reason: "'h' harfi bilan yoziladi (shahar)" },
  'shaxarda': { correct: 'shaharda', reason: "'h' harfi bilan yoziladi" },
  'shaxarlar': { correct: 'shaharlar', reason: "'h' harfi bilan yoziladi" },
  'xam': { correct: 'ham', reason: "'h' harfi bilan yoziladi (ham)" },
  'xaqiqat': { correct: 'haqiqat', reason: "'h' harfi bilan yoziladi (haqiqat)" },
  'xaqiqiy': { correct: 'haqiqiy', reason: "'h' harfi bilan yoziladi (haqiqiy)" },
  'xozir': { correct: 'hozir', reason: "'h' harfi bilan yoziladi (hozir)" },
  'xozirda': { correct: 'hozirda', reason: "'h' harfi bilan yoziladi" },
  'xurmat': { correct: 'hurmat', reason: "'h' harfi bilan yoziladi (hurmat)" },
  'muxim': { correct: 'muhim', reason: "'h' harfi bilan yoziladi (muhim)" },
  'extiyot': { correct: 'ehtiyot', reason: "'h' harfi bilan yoziladi (ehtiyot)" },
  'baht': { correct: 'baxt', reason: "'x' harfi bilan yoziladi (baxt)" },
  'bahtli': { correct: 'baxtli', reason: "'x' harfi bilan yoziladi (baxtli)" },
  'hizmat': { correct: 'xizmat', reason: "'x' harfi bilan yoziladi (xizmat)" },
  'hizmatchi': { correct: 'xizmatchi', reason: "'x' harfi bilan yoziladi" },
  'hush': { correct: 'xush', reason: "'x' harfi bilan yoziladi (xush kelibsiz)" },
  'xatto': { correct: 'hatto', reason: "'h' harfi bilan yoziladi (hatto)" },
  'halq': { correct: 'xalq', reason: "'x' harfi bilan yoziladi (xalq)" },
  'hislat': { correct: 'xislat', reason: "'x' harfi bilan yoziladi (xislat)" },
  'hona': { correct: 'xona', reason: "'x' harfi bilan yoziladi (xona)" },
  'honada': { correct: 'xonada', reason: "'x' harfi bilan yoziladi" },
  'xar': { correct: 'har', reason: "'h' harfi bilan yoziladi (har bir)" },
  'xarxil': { correct: 'har xil', reason: "'h' harfi bilan va ajratib yoziladi" },
  'xammaga': { correct: 'hammaga', reason: "'h' harfi bilan yoziladi (hammaga)" },
  'xamma': { correct: 'hamma', reason: "'h' harfi bilan yoziladi (hamma)" },
  'havfli': { correct: 'xavfli', reason: "'x' harfi bilan yoziladi (xavfli)" },
  'havfsiz': { correct: 'xavfsiz', reason: "'x' harfi bilan yoziladi (xavfsiz)" },
  'hatolar': { correct: 'xatolar', reason: "'x' harfi bilan yoziladi (xatolar)" },
  'hato': { correct: 'xato', reason: "'x' harfi bilan yoziladi (xato)" },
  'vaxt': { correct: 'vaqt', reason: "'q' harfi bilan yoziladi (vaqt)" },
  'vaxti': { correct: 'vaqti', reason: "'q' harfi bilan yoziladi (vaqti)" },
  'vaxtim': { correct: 'vaqtim', reason: "'q' harfi bilan yoziladi (vaqtim)" },
  'xursandman': { correct: 'xursandman', reason: "'x' harfi bilan yoziladi" },

  // Tutuq belgisi (Apostrophe)
  'mano': { correct: "ma'no", reason: "Tutuq belgisi bilan yoziladi: ma'no" },
  'manoli': { correct: "ma'noli", reason: "Tutuq belgisi bilan yoziladi: ma'noli" },
  'manosiz': { correct: "ma'nosiz", reason: "Tutuq belgisi bilan yoziladi: ma'nosiz" },
  'manaviy': { correct: "ma'naviy", reason: "Tutuq belgisi bilan yoziladi: ma'naviy" },
  'manaviyat': { correct: "ma'naviyat", reason: "Tutuq belgisi bilan yoziladi: ma'naviyat" },
  'talim': { correct: "ta'lim", reason: "Tutuq belgisi bilan yoziladi: ta'lim" },
  'tarbiya': { correct: 'tarbiya', reason: 'To‘g‘ri shakl' },
  'sanat': { correct: "san'at", reason: "Tutuq belgisi bilan yoziladi: san'at" },
  'sanatkor': { correct: "san'atkor", reason: "Tutuq belgisi bilan yoziladi: san'atkor" },
  'etibor': { correct: "e'tibor", reason: "Tutuq belgisi bilan yoziladi: e'tibor" },
  'etiborsiz': { correct: "e'tiborsiz", reason: "Tutuq belgisi bilan yoziladi: e'tiborsiz" },
  'elon': { correct: "e'lon", reason: "Tutuq belgisi bilan yoziladi: e'lon" },
  'masul': { correct: "mas'ul", reason: "Tutuq belgisi bilan yoziladi: mas'ul" },
  'masuliyat': { correct: "mas'uliyat", reason: "Tutuq belgisi bilan yoziladi: mas'uliyat" },
  'tasir': { correct: "ta'sir", reason: "Tutuq belgisi bilan yoziladi: ta'sir" },
  'tasirli': { correct: "ta'sirli", reason: "Tutuq belgisi bilan yoziladi: ta'sirli" },
  'mojiza': { correct: "mo''jiza", reason: "Ikkita tutuq belgisi yoki uzaytirish: mo''jiza" },
  'sher': { correct: "she'r", reason: "Tutuq belgisi bilan yoziladi: she'r (nazm)" },
  'sherlar': { correct: "she'rlar", reason: "Tutuq belgisi bilan: she'rlar" },
  'talafuz': { correct: 'talaffuz', reason: "Ikkita 'f' bilan yoziladi (talaffuz)" },
  'gramatika': { correct: 'grammatika', reason: "Ikkita 'm' bilan yoziladi (grammatika)" },

  // Og'zaki / Lahja shakllari (Colloquial & Speech-to-text drops)
  'kemadi': { correct: 'kelmadi', reason: "Adabiy tilda 'l' tushirilmaydi: kelmadi" },
  'kemayapti': { correct: 'kelmayapti', reason: "Adabiy tilda: kelmayapti" },
  'kegan': { correct: 'kelgan', reason: "Adabiy tilda: kelgan" },
  'bovotti': { correct: "bo'lyapti", reason: "Adabiy tilda: bo'lyapti" },
  'ketvotti': { correct: 'ketyapti', reason: "Adabiy tilda: ketyapti" },
  'ovotti': { correct: 'olyapti', reason: "Adabiy tilda: olyapti" },
  'qilvotti': { correct: 'qilyapti', reason: "Adabiy tilda: qilyapti" },
  'bogan': { correct: "bo'lgan", reason: "Adabiy tilda: bo'lgan" },
  'bop': { correct: "bo'lib", reason: "Adabiy tilda: bo'lib" },
  'bopti': { correct: "bo'pti", reason: "Tutuq belgisi bilan: bo'pti" },
  'biza': { correct: 'bizlar', reason: "Adabiy tilda: biz yoki bizlar" },
  'sila': { correct: 'sizlar', reason: "Adabiy tilda: siz yoki sizlar" },
  'aytishuvotti': { correct: 'aytishyapti', reason: "Adabiy tilda: aytishyapti" },
  'gapirishuvotti': { correct: 'gapirishyapti', reason: "Adabiy tilda: gapirishyapti" },
  'chuntim': { correct: 'tushundim', reason: "Adabiy tilda: tushundim" },
  'chundim': { correct: 'tushundim', reason: "Adabiy tilda: tushundim" },
  'chundinmi': { correct: 'tushundingmi', reason: "Adabiy tilda: tushundingmi" },
  'yoziw': { correct: 'yozish', reason: "Lotin alifbosida 'sh' yoziladi: yozish" },
  'oqish': { correct: "o'qish", reason: "Apostrof bilan yoziladi: o'qish" },
  'organish': { correct: "o'rganish", reason: "Apostrof bilan yoziladi: o'rganish" },
  'ozim': { correct: "o'zim", reason: "Apostrof bilan yoziladi: o'zim" },
  'ozi': { correct: "o'zi", reason: "Apostrof bilan yoziladi: o'zi" },
  'ozimiz': { correct: "o'zimiz", reason: "Apostrof bilan yoziladi: o'zimiz" },
  'gorur': { correct: "g'urur", reason: "Apostrof bilan yoziladi: g'urur" },
  'golib': { correct: "g'olib", reason: "Apostrof bilan yoziladi: g'olib" },
  'gozallik': { correct: "go'zallik", reason: "Apostrof bilan yoziladi: go'zallik" },
  'gozal': { correct: "go'zal", reason: "Apostrof bilan yoziladi: go'zal" },
};

// Scan text for spelling issues
export function findUzbekSpellingIssues(text: string): SpellingIssue[] {
  if (!text || text.trim().length === 0) return [];

  const issues: SpellingIssue[] = [];
  // Match words, including apostrophes within words
  const wordRegex = /[a-zA-Zʻʼ'`’‘]+/g;
  let match: RegExpExecArray | null;

  while ((match = wordRegex.exec(text)) !== null) {
    const rawWord = match[0];
    const startIndex = match.index;
    const lowerWord = rawWord
      .toLowerCase()
      .replace(/[ʻʼ`’‘]/g, "'"); // normalize apostrophe

    // Check direct dictionary corrections
    if (COMMON_UZBEK_CORRECTIONS[lowerWord]) {
      const matchRule = COMMON_UZBEK_CORRECTIONS[lowerWord];
      const isCapitalized = /^[A-Z]/.test(rawWord);
      let suggested = matchRule.correct;
      if (isCapitalized) {
        suggested = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      }

      issues.push({
        id: `${startIndex}-${lowerWord}`,
        word: rawWord,
        suggestion: suggested,
        reason: matchRule.reason,
        index: startIndex,
        length: rawWord.length,
      });
    }

    // Check for erroneous backtick apostrophes like o` or g`
    if (/[ogOG][`’‘]/.test(rawWord)) {
      const fixed = rawWord.replace(/([ogOG])[`’‘]/g, "$1'");
      issues.push({
        id: `${startIndex}-apostrophe`,
        word: rawWord,
        suggestion: fixed,
        reason: "Lotin imlosida tutuq/ayirish belgisi to'g'ri apostrof (') bilan yoziladi",
        index: startIndex,
        length: rawWord.length,
      });
    }
  }

  return issues;
}

// Post-process speech recognition output to literary, clean Uzbek
export function normalizeUzbekVoiceText(speechText: string): string {
  if (!speechText) return '';

  let normalized = speechText;

  // 1. Normalize all irregular apostrophes (` , ’, ‘, ʻ, ʼ) to standard single quote '
  normalized = normalized.replace(/([ogOG])[ʻʼ`’‘]/g, "$1'");

  // 2. Map common colloquial speech-to-text words to standard literary Uzbek
  const speechMap: [RegExp, string][] = [
    [/\bkemadi\b/gi, 'kelmadi'],
    [/\bkemayapti\b/gi, 'kelmayapti'],
    [/\bkegan\b/gi, 'kelgan'],
    [/\bbovotti\b/gi, "bo'lyapti"],
    [/\bketvotti\b/gi, 'ketyapti'],
    [/\bovotti\b/gi, 'olyapti'],
    [/\bqilvotti\b/gi, 'qilyapti'],
    [/\bbogan\b/gi, "bo'lgan"],
    [/\bbop\s+qoldi\b/gi, "bo'lib qoldi"],
    [/\bbop\s+ketdi\b/gi, "bo'lib ketdi"],
    [/\bbop\b/gi, "bo'lib"],
    [/\bbopti\b/gi, "bo'pti"],
    [/\bbiza\b/gi, 'biz'],
    [/\bsila\b/gi, 'siz'],
    [/\bchundim\b/gi, 'tushundim'],
    [/\bchuntim\b/gi, 'tushundim'],
    [/\bchundizmi\b/gi, 'tushundingizmi'],
    [/\bxarakat\b/gi, 'harakat'],
    [/\braxmat\b/gi, 'rahmat'],
    [/\bshaxar\b/gi, 'shahar'],
    [/\bshaxarda\b/gi, 'shaharda'],
    [/\bxam\b/gi, 'ham'],
    [/\bxaqiqat\b/gi, 'haqiqat'],
    [/\bxozir\b/gi, 'hozir'],
    [/\bmuxim\b/gi, 'muhim'],
    [/\bbaht\b/gi, 'baxt'],
    [/\bbahtli\b/gi, 'baxtli'],
    [/\bhizmat\b/gi, 'xizmat'],
    [/\bhursand\b/gi, 'xursand'],
    [/\bvaxt\b/gi, 'vaqt'],
    [/\bvaxti\b/gi, 'vaqti'],
    [/\bvaxtim\b/gi, 'vaqtim'],
    [/\bmano\b/gi, "ma'no"],
    [/\btalim\b/gi, "ta'lim"],
    [/\bsanat\b/gi, "san'at"],
    [/\betibor\b/gi, "e'tibor"],
    [/\belon\b/gi, "e'lon"],
    [/\btasir\b/gi, "ta'sir"],
    [/\bmasul\b/gi, "mas'ul"],
  ];

  for (const [pattern, replacement] of speechMap) {
    normalized = normalized.replace(pattern, replacement);
  }

  // 3. Ensure sentence starting letter is capitalized if starting fresh
  if (normalized.length > 0) {
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  return normalized;
}
