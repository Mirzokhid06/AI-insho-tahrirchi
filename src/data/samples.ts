import { GenreDefinition, WritingSample } from '../types.ts';

export const GENRES: GenreDefinition[] = [
  {
    id: 'badiiy_hikoya',
    label: 'Badiiy Hikoya',
    tagline: 'Tasviriy quvvat, metaforalar va jonli obrazlar',
    defaultTemp: 0.85,
    badge: 'T: 0.85',
    hint: "Voqealarni shunchaki aytib bermang, o'quvchi ko'z o'ngida gavdalantiring.",
  },
  {
    id: 'blog_post',
    label: 'Ta\'sirchan Blog',
    tagline: 'Kuchli kirish (hook), dinamika va ochiq muloqot',
    defaultTemp: 0.70,
    badge: 'T: 0.70',
    hint: "Birinchi uch jumla bilan o'quvchi diqqatini torting va samimiy so'zlang.",
  },
  {
    id: 'falsafiy_esse',
    label: 'Falsafiy Insho',
    tagline: 'Mantiqiy teranlik, salmoqli fikrlar va pishiq xulosalar',
    defaultTemp: 0.55,
    badge: 'T: 0.55',
    hint: "Fikrlar oqimi mustahkam zanjirdek bir-biriga bog'langan bo'lsin.",
  },
  {
    id: 'qisqa_hikoya',
    label: 'Lirik Miniatyura',
    tagline: 'Nozik tuyg\'ular, psixologik kechinmalar va yurak sadosi',
    defaultTemp: 0.80,
    badge: 'T: 0.80',
    hint: "Ortiqcha so'zlarni olib tashlang, har bir so'zga qalb haroratini bering.",
  },
];

export const SAMPLES: WritingSample[] = [
  {
    id: 'kuz_kechasi',
    genre: 'badiiy_hikoya',
    title: 'Kuz oqshomidagi xotira',
    note: "Quruq jumlalarni jonli badiiy tasvirga aylantirish namunasi",
    text: `Kuz keldi. Daraxtlarning barglari sarg'ayib yerga tushayotgan edi. Havo ancha sovuq bo'lib qoldi. Men ko'chada yolg'iz ketayotgan edim. Qadimgi tor ko'chamiz jimjit edi. Bolaligim o'tgan uy oldiga bordim. Derazadan xira yorug'lik tushib turardi. Ichkaridan onamning ovozi kelayotgandek tuyuldi va yuragim ezildi.`,
  },
  {
    id: 'vaqt_qadri',
    genre: 'blog_post',
    title: 'Nega biz doim vaqt yetmayapti deb noliymiz?',
    note: "O'quvchini darhol o'ziga jalb qiluvchi zamonaviy blog post",
    text: `Hammaga salom. Bugun vaqt haqida gaplashamiz. Ko'pchilik menga vaqtim yo'q deb aytadi. Aslida esa har kuni telefonimizda 4-5 soat vaqtimizni bekorga sarflaymiz. Keyin esa kitob o'qishga, sportga yoki oilamizga vaqt topolmaymiz. Men yaqinda bir tajriba qilib ko'rdim va barcha bildirishnomalarni o'chirib qo'ydim. Natijada hayotim tubdan o'zgardi. Siz ham shunday qilib ko'ring.`,
  },
  {
    id: 'kitob_va_tafakkur',
    genre: 'falsafiy_esse',
    title: 'Kitob mutolaasi va shaxsiy erkinlik',
    note: "Fikrlar salmog'i va teran falsafiy ketma-ketlik",
    text: `Inson qachon haqiqiy erkin bo'ladi? Ko'pchilik buni moddiy mustaqillik bilan bog'laydi. Ammo eng katta tutqunlik — bu fikrsizlik va o'zgalar qolipida yashashdir. Mutolaa inson ongini tor doiradan olib chiqadi. Kitob o'qigan kishi o'zining ichki olamini kashf etadi va mustaqil fikrlay boshlaydi. Biz qanchalik ko'p o'qisak, o'zimizni shunchalik chuqur anglaymiz.`,
  },
  {
    id: 'yomgir_va_sukut',
    genre: 'qisqa_hikoya',
    title: 'Poezd derazasidagi yomg\'ir',
    note: "Nozik kechinma va psixologik chizgilar",
    text: `Poezd jildiradi. Oynaga mayda yomg'ir tomchilari urilar edi. Qarshimdagi o'rindiqda bir qariya o'tirgan, u uzoqlarga qarab jim ketardi. Uning qo'llari qaltirardi. Chamasi, u ham qachonlardir bu yo'ldan yoshligida o'tgan. Men unga biror narsa demoqchi bo'ldim, lekin jim qoldim. Chunki ba'zida sukut har qanday so'zdan ko'proq ma'no beradi.`,
  },
];
