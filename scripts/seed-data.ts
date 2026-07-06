import type { Category, Region } from "../lib/types";

export interface SeedSource {
  name: string;
  homepageUrl: string;
  feedUrl?: string;
  reusePolicy: "full_rewrite" | "report_only";
}

export interface SeedArticle {
  slug: string;
  title: string;
  tldr: string[];
  content: string;
  category: Category;
  region: Region;
  imageUrl: string;
  /** ISO 8601 */
  publishedAt: string;
  readTimeMinutes: number;
  viewCount: number;
  sources: { name: string; url: string }[];
}

// TZ 4.1: har manbaning qayta ishlatish sharti hujjatlashtiriladi.
// full_rewrite â to'liq qayta yozish mumkin; report_only â faqat "xabar berish".
export const seedSources: SeedSource[] = [
  {
    name: "UzA",
    homepageUrl: "https://uza.uz",
    feedUrl: "https://uza.uz/uz/rss",
    reusePolicy: "full_rewrite",
  },
  // Kun.uz / Spot.uz: feed URL'lari hali tasdiqlanmagan (404) â feedsiz
  // qoldirildi; to'g'ri manzil topilgach qo'shiladi (Faza 2: 15+ manba).
  { name: "Kun.uz", homepageUrl: "https://kun.uz", reusePolicy: "report_only" },
  {
    name: "Gazeta.uz",
    homepageUrl: "https://www.gazeta.uz",
    feedUrl: "https://www.gazeta.uz/uz/rss/",
    reusePolicy: "report_only",
  },
  { name: "Spot.uz", homepageUrl: "https://www.spot.uz", reusePolicy: "report_only" },
  // Xalqaro manbalar (report_only) â feed keyingi bosqichlarda ulanadi.
  { name: "Reuters", homepageUrl: "https://www.reuters.com", reusePolicy: "report_only" },
  { name: "BBC", homepageUrl: "https://www.bbc.com", reusePolicy: "report_only" },
];

export const seedArticles: SeedArticle[] = [
  {
    slug: "it-park-eksporti-1-mlrd",
    title:
      "IT Park rezidentlarining yillik eksport hajmi ilk bor 1 milliard dollardan oshdi",
    tldr: [
      "Eksportning 70 foizdan ortig'i AQSh va Yevropa bozorlariga xizmatlar hissasiga to'g'ri keladi.",
      "Rezident kompaniyalar soni 2 400 tadan oshib, 45 mingdan ortiq ish o'rni yaratildi.",
      "2028-yilga qadar eksportni 5 milliard dollarga yetkazish maqsad qilingan.",
    ],
    content:
      "O'zbekiston IT Park rezidentlarining dasturiy mahsulot va xizmatlar eksporti yillik hisobda ilk bor 1 milliard dollardan oshdi. Rasmiy ma'lumotlarga ko'ra, so'nggi to'rt yilda eksport hajmi o'rtacha ikki baravardan tez sur'atda o'sib bormoqda.\n\nEksportning asosiy yo'nalishlari â buyurtma asosida dasturiy ta'minot ishlab chiqish, IT-autsorsing va biznes-jarayonlarni qo'llab-quvvatlash xizmatlari. Xaridorlarning katta qismi AQSh, Buyuk Britaniya va Germaniya kompaniyalari bo'lib, so'nggi yilda Yaqin Sharq bozorlarining ulushi ham sezilarli darajada ortdi.\n\nIT Park ma'muriyati 2028-yilga qadar eksport hajmini 5 milliard dollarga yetkazish, buning uchun xalqaro kompaniyalarning mahalliy ofislarini ochish va texnik ta'lim dasturlarini kengaytirish rejasini e'lon qildi. Ekspertlar bunga erishish uchun malakali kadrlar tayyorlash sur'atini kamida ikki baravar oshirish zarurligini ta'kidlamoqda.",
    category: "Texnologiya",
    region: "Uzbekistan",
    imageUrl: "https://picsum.photos/seed/aura-itpark/1200/800",
    publishedAt: "2026-07-02T14:20:00+05:00",
    readTimeMinutes: 4,
    viewCount: 8700,
    sources: [
      { name: "UzA", url: "https://uza.uz/uz/posts/it-park-eksport" },
      { name: "Spot.uz", url: "https://www.spot.uz/uz/2026/07/02/it-park-export" },
    ],
  },
  {
    slug: "senat-soliq-imtiyozlari",
    title:
      "Senat kichik biznes uchun yangi soliq imtiyozlari to'g'risidagi qonunni ma'qulladi",
    tldr: [
      "Yillik aylanmasi 1 milliard so'mgacha bo'lgan tadbirkorlar uchun soddalashtirilgan rejim kengaytiriladi.",
      "Yangi ro'yxatdan o'tgan ishlab chiqarish korxonalari 3 yilgacha mol-mulk solig'idan ozod etiladi.",
      "Qonun 2026-yil 1-oktabrdan kuchga kiradi.",
    ],
    content:
      "O'zbekiston Oliy Majlisi Senati kichik biznes va xususiy tadbirkorlikni qo'llab-quvvatlashga qaratilgan soliq imtiyozlari to'g'risidagi qonunni ma'qulladi. Hujjat quyi palata tomonidan o'tgan oy qabul qilingan edi.\n\nQonunga ko'ra, yillik aylanmasi belgilangan chegaradan oshmaydigan tadbirkorlik subyektlari uchun soddalashtirilgan soliq rejimi qo'llash doirasi kengaytiriladi, hisobot topshirish tartibi esa yiliga bir martagacha qisqartiriladi. Hududlarda yangi tashkil etilgan ishlab chiqarish korxonalari uchun dastlabki uch yilda mol-mulk solig'i bo'yicha imtiyoz nazarda tutilgan.\n\nHukumat vakillarining hisob-kitobiga ko'ra, yangi tartib 200 mingdan ortiq tadbirkorga taalluqli bo'ladi. Mustaqil iqtisodchilar esa imtiyozlarning byudjetga ta'sirini birinchi yil yakunlari bo'yicha qayta baholash zarurligini aytmoqda.",
    category: "Siyosat",
    region: "Uzbekistan",
    imageUrl: "https://picsum.photos/seed/aura-senat/1200/800",
    publishedAt: "2026-07-02T13:10:00+05:00",
    readTimeMinutes: 3,
    viewCount: 6400,
    sources: [
      { name: "UzA", url: "https://uza.uz/uz/posts/senat-soliq" },
      { name: "Gazeta.uz", url: "https://www.gazeta.uz/uz/2026/07/02/tax-benefits" },
    ],
  },
  {
    slug: "markaziy-bank-stavka",
    title:
      "Markaziy bank asosiy stavkani 13 foiz darajasida o'zgarishsiz qoldirdi",
    tldr: [
      "Regulyator qarorni inflyatsiya sur'atining sekinlashuvi bilan izohladi.",
      "Yillik inflyatsiya prognozi 8â9 foiz oralig'ida saqlanmoqda.",
      "Keyingi ko'rib chiqish sentabr oyiga rejalashtirilgan.",
    ],
    content:
      "O'zbekiston Markaziy banki boshqaruvi navbatdagi yig'ilishida asosiy stavkani yillik 13 foiz darajasida o'zgarishsiz qoldirishga qaror qildi. Bu qaror bozor kutilmalariga mos keldi.\n\nRegulyator bayonotida iste'mol narxlari o'sish sur'atining barqarorlashgani, biroq xizmatlar narxidagi bosim hali ham yuqoriligicha qolayotgani qayd etilgan. Shu sababli pul-kredit siyosatini yumshatishga shoshilmaslik, avval inflyatsion kutilmalarning mustahkam pasayishiga ishonch hosil qilish zarur deb topilgan.\n\nTahlilchilarning fikricha, agar yoz oylarida inflyatsiya prognoz doirasida qolsa, yil oxiriga qadar stavkani bosqichma-bosqich pasaytirish uchun imkoniyat paydo bo'ladi. Markaziy bankning keyingi yig'ilishi sentabr oyining ikkinchi yarmida o'tkazilishi kutilmoqda.",
    category: "Iqtisodiyot",
    region: "Uzbekistan",
    imageUrl: "https://picsum.photos/seed/aura-cbu/1200/800",
    publishedAt: "2026-07-02T11:00:00+05:00",
    readTimeMinutes: 3,
    viewCount: 11200,
    sources: [
      { name: "Gazeta.uz", url: "https://www.gazeta.uz/uz/2026/07/02/cbu-rate" },
      { name: "Spot.uz", url: "https://www.spot.uz/uz/2026/07/02/cbu" },
    ],
  },
  {
    slug: "yevropa-ittifoqi-iqlim-paketi",
    title:
      "Yevropa Ittifoqi 2040-yilgacha mo'ljallangan yangi iqlim paketini kelishib oldi",
    tldr: [
      "Hujjat issiqxona gazlari chiqindilarini 1990-yilga nisbatan 90 foizga qisqartirishni nazarda tutadi.",
      "Sanoat tarmoqlari uchun o'tish davri fondlari ikki baravarga oshiriladi.",
      "Ayrim a'zo davlatlar avtomobil sanoatiga oid bandlarga e'tiroz bildirgan.",
    ],
    content:
      "Yevropa Ittifoqiga a'zo davlatlar uzoq davom etgan muzokaralardan so'ng 2040-yilgacha mo'ljallangan yangi iqlim maqsadlari paketini kelishib oldi. Hujjat issiqxona gazlari chiqindilarini 1990-yil darajasiga nisbatan 90 foizga qisqartirishni nazarda tutadi.\n\nKelishuvga ko'ra, energiya sig'imi yuqori bo'lgan sanoat tarmoqlari uchun o'tish davri fondlari kengaytiriladi, uglerod chegarasi mexanizmi esa yangi tovar guruhlarini qamrab oladi. Bir qator a'zo davlatlar avtomobilsozlikka oid talablarni yumshatishni so'ragani sababli, yakuniy matnda alohida ko'rib chiqish bandlari saqlab qolindi.\n\nEkologik tashkilotlar kelishuvni \"muhim, ammo yetarli emas\" deb baholadi. Sanoat birlashmalari esa yangi talablarning raqobatbardoshlikka ta'sirini mustaqil baholashni talab qilmoqda. Paket endi Yevropa parlamentida yakuniy ovozga qo'yiladi.",
    category: "Siyosat",
    region: "Jahon",
    imageUrl: "https://picsum.photos/seed/aura-eu/1200/800",
    publishedAt: "2026-07-02T09:40:00+05:00",
    readTimeMinutes: 5,
    viewCount: 5300,
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/sustainability/eu-2040-climate" },
      { name: "BBC", url: "https://www.bbc.com/news/world-europe-eu-climate" },
    ],
  },
  {
    slug: "exoplanet-suv-belgilar",
    title:
      "Astronomlar yaqin ekzosayyora atmosferasida suv bug'i izlarini aniqladi",
    tldr: [
      "Kashfiyot Yerdan 40 yorug'lik yili uzoqlikdagi sayyora atmosferasini o'rganish asnosida qilindi.",
      "Spektral tahlil suv bug'i bilan birga metan mavjudligini ham ko'rsatgan.",
      "Olimlar xulosani tasdiqlash uchun qo'shimcha kuzatuvlar zarurligini ta'kidlamoqda.",
    ],
    content:
      "Xalqaro astronomlar guruhi Yerdan qariyb 40 yorug'lik yili uzoqlikda joylashgan ekzosayyora atmosferasida suv bug'i izlarini aniqlaganini ma'lum qildi. Kuzatuvlar kosmik teleskopning infraqizil spektrometri yordamida olib borilgan.\n\nTadqiqot mualliflarining yozishicha, sayyora o'z yulduzining \"yashash uchun qulay\" deb ataladigan mintaqasida joylashgan bo'lib, spektral ma'lumotlarda suv bug'i bilan bir qatorda metan belgilariga ham ishora bor. Shu bilan birga, olimlar bu natijalar hayot mavjudligini anglatmasligini, faqat atmosfera kimyosi haqidagi dastlabki xulosa ekanini alohida ta'kidlagan.\n\nGuruh kelgusi kuzatuv mavsumida sayyorani yana kamida uch marta o'rganishni rejalashtirmoqda. Natijalar mustaqil guruhlar tomonidan takroriy tahlildan o'tkazilgach, yakuniy ilmiy maqola e'lon qilinadi.",
    category: "Ilm-fan",
    region: "Jahon",
    imageUrl: "https://picsum.photos/seed/aura-space/1200/800",
    publishedAt: "2026-07-02T08:05:00+05:00",
    readTimeMinutes: 4,
    viewCount: 4100,
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/science/exoplanet-water-vapor" },
      { name: "BBC", url: "https://www.bbc.com/news/science-exoplanet" },
    ],
  },
  {
    slug: "jahon-banki-prognoz",
    title:
      "Jahon banki global iqtisodiy o'sish prognozini 3,1 foizga ko'tardi",
    tldr: [
      "Yangi prognoz avvalgi bahoga nisbatan 0,3 foiz bandga yuqori.",
      "O'sishning asosiy omili sifatida Osiyo bozorlaridagi ichki talab ko'rsatilgan.",
      "Hisobotda savdo cheklovlari asosiy xavf sifatida qayd etilgan.",
    ],
    content:
      "Jahon banki yangilangan hisobotida joriy yil uchun global iqtisodiy o'sish prognozini 3,1 foizga ko'tardi. Bu bahordagi bahoga nisbatan 0,3 foiz bandga yuqori ko'rsatkichdir.\n\nHisobotda qayd etilishicha, prognozning yaxshilanishi asosan Janubiy va Markaziy Osiyo mamlakatlaridagi ichki talabning kutilganidan kuchli bo'lgani, shuningdek, energiya narxlarining barqarorlashuvi bilan bog'liq. Rivojlanayotgan bozorlar uchun o'rtacha o'sish 4 foizdan yuqori darajada prognoz qilinmoqda.\n\nShu bilan birga, hisobot mualliflari savdo cheklovlarining kengayishi va qarz yukining ortishini asosiy xavflar sifatida ko'rsatgan. Ular past daromadli mamlakatlarga qarzni qayta ko'rib chiqish mexanizmlarini tezlashtirishni tavsiya qilgan.",
    category: "Iqtisodiyot",
    region: "Jahon",
    imageUrl: "https://picsum.photos/seed/aura-wb/1200/800",
    publishedAt: "2026-07-02T07:30:00+05:00",
    readTimeMinutes: 4,
    viewCount: 3800,
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/markets/world-bank-forecast" },
      { name: "BBC", url: "https://www.bbc.com/news/business-world-bank" },
    ],
  },
  {
    slug: "terma-jamoa-osiyo-kubogi",
    title:
      "O'zbekiston termasi Osiyo kubogi saralashida qo'shni jamoani 2:0 hisobida mag'lub etdi",
    tldr: [
      "Gollarni ikkinchi bo'limda Abbosbek Fayzullayev va Eldor Shomurodov kiritdi.",
      "Terma jamoa guruhda 4 o'yindan so'ng 10 ochko bilan yetakchilikni saqlab qolmoqda.",
      "Navbatdagi uchrashuv oktabr oyida safarda o'tkaziladi.",
    ],
    content:
      "O'zbekiston futbol terma jamoasi Osiyo kubogi saralash bosqichi doirasidagi navbatdagi uchrashuvda o'z maydonida 2:0 hisobida g'alaba qozondi. O'yinning birinchi bo'limi zich himoya fonida gol-siz yakunlandi.\n\nTanaffusdan so'ng bosh murabbiy hujum yo'nalishida ikkita almashtirish qildi va bu o'zini oqladi: avval Abbosbek Fayzullayev masofadan aniq zarba bilan hisobni ochdi, o'yin oxirida esa Eldor Shomurodov burchak to'pidan so'ng ustunlikni mustahkamladi.\n\nUshbu g'alabadan so'ng terma jamoa guruhda 4 o'yinda 10 ochko to'plab, turnir jadvalining birinchi qatorida bormoqda. Navbatdagi tur oktabr oyida safarda o'tkaziladi va unda guruhdagi asosiy raqib bilan yuzma-yuz kelinadi.",
    category: "Sport",
    region: "Uzbekistan",
    imageUrl: "https://picsum.photos/seed/aura-football/1200/800",
    publishedAt: "2026-07-01T21:15:00+05:00",
    readTimeMinutes: 3,
    viewCount: 15600,
    sources: [
      { name: "Kun.uz", url: "https://kun.uz/uz/news/2026/07/01/terma-jamoa" },
      { name: "UzA", url: "https://uza.uz/uz/posts/asia-cup-qualifier" },
    ],
  },
  {
    slug: "data-markazlar-energiya",
    title:
      "Hisobot: AI data-markazlari elektr iste'moli bo'yicha ayrim davlatlarni ortda qoldirdi",
    tldr: [
      "Global data-markazlar iste'moli yiliga 600 TVtÂ·soatdan oshgani baholanmoqda.",
      "Yirik texnologiya kompaniyalari atom energetikasi loyihalariga sarmoya kiritmoqda.",
      "Mutaxassislar energiya samaradorligi standartlarini joriy etishga chaqirmoqda.",
    ],
    content:
      "Xalqaro energetika tahlil markazining yangi hisobotiga ko'ra, sun'iy intellekt modellarini o'qitish va ishlatish uchun xizmat qiluvchi data-markazlarning yillik elektr iste'moli 600 teravatt-soatdan oshdi. Bu ko'rsatkich bir qator o'rta hajmdagi davlatlarning yillik iste'molidan yuqori.\n\nHisobotda qayd etilishicha, so'nggi ikki yilda yangi quvvatlarning asosiy qismi AI hisob-kitoblariga mo'ljallangan maxsus klasterlar hissasiga to'g'ri kelgan. Shu fonda yirik texnologiya kompaniyalari uzoq muddatli energiya shartnomalari va kichik modulli atom reaktorlari loyihalariga sarmoya kiritishni faollashtirgan.\n\nMualliflar tarmoq uchun majburiy energiya samaradorligi standartlari va shaffof hisobot talablarini joriy etishni taklif qilmoqda. Aks holda, ularning bahosiga ko'ra, ayrim mintaqalarda elektr tarmoqlariga bosim keskin ortishi mumkin.",
    category: "Texnologiya",
    region: "Jahon",
    imageUrl: "https://picsum.photos/seed/aura-dc/1200/800",
    publishedAt: "2026-07-01T16:30:00+05:00",
    readTimeMinutes: 5,
    viewCount: 7200,
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/technology/ai-datacenter-energy" },
      { name: "BBC", url: "https://www.bbc.com/news/technology-datacenters" },
    ],
  },
  {
    slug: "quyosh-panel-qoplama",
    title:
      "O'zbekistonlik olimlar quyosh panellari unumdorligini oshiruvchi qoplama ishlab chiqdi",
    tldr: [
      "Nano-qoplama panel yuzasida chang to'planishini kamaytirib, unumdorlikni 8 foizgacha oshiradi.",
      "Texnologiya issiq va changli iqlim sharoitida sinovdan o'tkazilgan.",
      "Ishlanma bo'yicha xalqaro patent talabnomasi topshirilgan.",
    ],
    content:
      "Fanlar akademiyasi qoshidagi materialshunoslik instituti olimlari quyosh panellari uchun changni qaytaruvchi va yorug'lik o'tkazuvchanligini yaxshilovchi nano-qoplama ishlab chiqqanini ma'lum qildi. Laboratoriya sinovlarida qoplama panel unumdorligini o'rtacha 6â8 foizga oshirgan.\n\nTadqiqot guruhining aytishicha, ishlanmaning asosiy afzalligi â mahalliy xomashyo asosida arzon ishlab chiqarish imkoniyati va issiq iqlimga chidamlilik. Dala sinovlari yozgi mavsumda Navoiy viloyatidagi quyosh stansiyalaridan birida o'tkazilgan bo'lib, qoplamali panellarda chang tufayli yo'qotishlar sezilarli kamaygan.\n\nInstitut ishlanma bo'yicha xalqaro patent talabnomasi topshirgan va sanoat miqyosida ishlab chiqarish uchun hamkorlar bilan muzokara olib bormoqda. Keyingi bosqichda qoplamaning xizmat muddati bo'yicha uzoq muddatli sinovlar rejalashtirilgan.",
    category: "Ilm-fan",
    region: "Uzbekistan",
    imageUrl: "https://picsum.photos/seed/aura-solar/1200/800",
    publishedAt: "2026-07-01T10:00:00+05:00",
    readTimeMinutes: 4,
    viewCount: 5900,
    sources: [
      { name: "UzA", url: "https://uza.uz/uz/posts/solar-coating" },
      { name: "Gazeta.uz", url: "https://www.gazeta.uz/uz/2026/07/01/solar" },
    ],
  },
  {
    slug: "chempionlar-ligasi-final",
    title:
      "Chempionlar ligasi finali qo'shimcha vaqtda hal bo'ldi: kubok yana Angliyaga qaytdi",
    tldr: [
      "Asosiy vaqt 1:1 hisobida yakunlanib, taqdir qo'shimcha vaqtda hal bo'ldi.",
      "G'olib jamoa so'nggi 10 daqiqada kiritilgan gol evaziga kubokni qo'lga kiritdi.",
      "Final o'yinini stadionda 75 mingdan ortiq muxlis kuzatdi.",
    ],
    content:
      "Yevropa Chempionlar ligasining hal qiluvchi o'yini haqiqiy final darajasidagi dramaga boy bo'ldi. Asosiy vaqt 1:1 hisobida tugagach, g'olib qo'shimcha vaqtda aniqlandi.\n\nO'yinning birinchi bo'limida hisobni ochgan jamoa ikkinchi bo'lim o'rtasida penaltidan gol o'tkazib yubordi. Qo'shimcha vaqtning so'nggi daqiqalarida esa o'rinbosarlar hisobidan maydonga tushgan hujumchi shtrafnoy to'pidan hal qiluvchi golni kiritdi.\n\nUshbu g'alaba bilan kubok yana Angliya klublariga qaytdi. Final o'yinini stadionda 75 mingdan ortiq muxlis, teleko'rsatuvlar orqali esa yuzlab million tomoshabin kuzatgani ma'lum qilindi.",
    category: "Sport",
    region: "Jahon",
    imageUrl: "https://picsum.photos/seed/aura-ucl/1200/800",
    publishedAt: "2026-06-30T23:45:00+05:00",
    readTimeMinutes: 3,
    viewCount: 13400,
    sources: [
      { name: "Reuters", url: "https://www.reuters.com/sports/soccer/ucl-final" },
      { name: "BBC", url: "https://www.bbc.com/sport/football/ucl-final" },
    ],
  },
  {
    slug: "raqamli-som-pilot",
    title:
      "Markaziy bank raqamli so'm bo'yicha pilot loyihaning ikkinchi bosqichini boshladi",
    tldr: [
      "Sinovga uchta tijorat banki va 10 mingga yaqin ko'ngilli foydalanuvchi jalb qilinadi.",
      "Ikkinchi bosqichda chakana to'lovlar va byudjet to'lovlari sinovdan o'tkaziladi.",
      "Yakuniy hisobot 2027-yil boshida e'lon qilinishi kutilmoqda.",
    ],
    content:
      "O'zbekiston Markaziy banki raqamli so'm bo'yicha pilot loyihaning ikkinchi bosqichi boshlanganini e'lon qildi. Birinchi bosqichda texnologik platforma banklararo hisob-kitoblarda yopiq rejimda sinovdan o'tkazilgan edi.\n\nYangi bosqichda sinovga uchta tijorat banki hamda ko'ngilli foydalanuvchilar guruhi jalb qilinadi. Ular raqamli so'm orqali chakana to'lovlar, kommunal xizmatlar va ayrim byudjet to'lovlarini amalga oshirish imkonini oladi. Regulyator sinov davomida operatsiyalar limitlari cheklangan bo'lishini ta'kidlagan.\n\nMarkaziy bank raqamli valyutani joriy etish bo'yicha yakuniy qaror pilot natijalariga qarab qabul qilinishini, texnik va huquqiy xulosalar aks etgan hisobot esa 2027-yil boshida e'lon qilinishini ma'lum qildi.",
    category: "Texnologiya",
    region: "Uzbekistan",
    imageUrl: "https://picsum.photos/seed/aura-cbdc/1200/800",
    publishedAt: "2026-07-02T05:50:00+05:00",
    readTimeMinutes: 4,
    viewCount: 6100,
    sources: [
      { name: "Gazeta.uz", url: "https://www.gazeta.uz/uz/2026/07/02/digital-som" },
      { name: "Spot.uz", url: "https://www.spot.uz/uz/2026/07/02/cbdc-pilot" },
    ],
  },
];
