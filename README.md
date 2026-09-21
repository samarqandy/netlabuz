# NETLAB.UZ — IT Ta'lim Platformasi

Samarqand IT o'quv markazi (Cisco, Linux, IoT, CCTV, Network) uchun zamonaviy ko'p tilli (UZ / RU / EN) veb-sayt. Eski bir faylli statik `index.html` saytdan to'liq **Next.js 14** ilovasiga qayta qurilgan.

> **Branch strategiyasi:** `redesign-nextjs` — yangi Next.js ilovasi. `main` — jonli statik sayt (merge qilingunga qadar tegilmaydi).

---

## Texnologiyalar

| Qatlam | Tanlov |
|---|---|
| Framework | **Next.js 14** (App Router, `src/`) |
| Til | TypeScript (strict) |
| Stillar | Tailwind CSS + shadcn/ui (semantik HSL tokenlar) |
| Animatsiya | Framer Motion (`reducedMotion="user"`) |
| i18n | next-intl (`uz` / `ru` / `en`, default `uz`, `localePrefix: always`) |
| Mavzu | next-themes (dark — asosiy) |
| Ikonkalar | lucide-react |
| Deploy | Vercel |

---

## Loyiha strukturasi

```
netlabuz/
├── messages/                  ← i18n tarjimalari (uz.json, ru.json, en.json)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          ← shrift, metadata, JSON-LD, providerlar
│   │   │   ├── page.tsx            ← bosh sahifa (Hero + Courses + seksiyalar)
│   │   │   └── opengraph-image.tsx ← dinamik OG rasm (next/og)
│   │   ├── api/send/route.ts       ← Telegram forma proxy (Route Handler)
│   │   ├── globals.css             ← Tailwind + shadcn tokenlar + utilitalar
│   │   ├── robots.ts / sitemap.ts  ← SEO
│   ├── components/
│   │   ├── ui/                     ← shadcn UI kit (button, card, glow-card, ...)
│   │   ├── sections/               ← hero, courses, ...
│   │   ├── navbar / theme / language / motion providerlar
│   ├── i18n/                       ← routing, navigation, request (next-intl)
│   ├── lib/                        ← animations.ts, courses.ts, utils.ts
│   └── middleware.ts               ← locale routing
├── next.config.mjs                 ← next-intl plugin + xavfsizlik headerlari
└── tailwind.config.ts
```

---

## Forma → Telegram oqimi

```
Foydalanuvchi forma → /api/send (Vercel server) → Telegram API
                            ↑
                  Token faqat env'da (xavfsiz, kodda yo'q)
```

Validatsiya: ism (≥2), telefon (`+998XXXXXXXXX`), kurs majburiy. CORS `ALLOWED_ORIGIN` orqali cheklanadi.

---

## Lokal ishga tushirish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev                  # http://localhost:3000  →  /uz ga yo'naltiradi
```

| Skript | Vazifasi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Production serverni ishga tushirish |
| `npm run lint` | ESLint |

---

## Environment Variables

`.env.local` (lokal) yoki **Vercel → Settings → Environment Variables** (production):

| Name | Tavsif |
|---|---|
| `TELEGRAM_BOT_TOKEN` | @BotFather bergan bot tokeni |
| `TELEGRAM_CHAT_ID` | Xabar boradigan chat ID |
| `ALLOWED_ORIGIN` | CORS uchun ruxsat etilgan domen (`https://netlab.uz`) |

> ❌ `.env*` fayllarini hech qachon GitHub'ga push qilmang — token faqat Vercel env'da saqlanadi.

---

## Deploy (Vercel)

1. Yuqoridagi 3 ta env'ni Vercel'da qo'shing.
2. `redesign-nextjs` branch'ni push qiling — Vercel preview deploy beradi.
3. Tayyor bo'lganda `main`'ga merge → production.

Vercel `next.config.mjs`'ni avtomatik aniqlaydi (`vercel.json` shart emas). Xavfsizlik headerlari (HSTS, X-Frame-Options va h.k.) shu yerda.

---

## i18n qo'shish / tahrirlash

Matnlar `messages/{uz,ru,en}.json` da, namespace'lar bo'yicha (`Meta`, `Nav`, `Hero`, `Courses`, ...). Yangi til qo'shish: `src/i18n/routing.ts` da `locales`'ga qo'shing va mos `messages/<locale>.json` yarating.

---

## Kurs sahifalari

Har kursning alohida sahifasi bor, URL tilga moslashgan (next-intl `pathnames`):

| Til | URL namunasi |
|---|---|
| uz | `/uz/kurslar/cisco-mikrotik-tarmoqlar` |
| ru | `/ru/kursy/cisco-mikrotik-tarmoqlar` |
| en | `/en/courses/cisco-mikrotik-tarmoqlar` |

- **Ma'lumot:** `src/lib/course-details.ts` — slug, modullar (texnologiya chiplari bilan), natija/auditoriya/talab/karyera kalitlari, asboblar.
- **Matnlar:** `messages/{uz,ru,en}.json` → `CourseDetail` namespace.
- **Sahifa:** `src/app/[locale]/courses/[slug]/page.tsx` — breadcrumb, hero + meta panel, natijalar, dastur akkordioni + yopishuvchi yozilish kartasi, texnologiyalar, kim uchun/talablar/karyera, CTA, boshqa kurslar.
- **SEO:** har kursga `Course` + `BreadcrumbList` JSON-LD, tilga mos canonical/hreflang, sitemap'da 18 ta kurs URL'i.
- **Konversiya:** "Ariza qoldirish" → `/{locale}?course=<id>#contact`, forma kursni avtomatik tanlaydi.

Yangi kurs qo'shish: `courses.ts` ga yozuv → `course-details.ts` ga slug/modullar → uch tilda `CourseDetail.<id>` matnlari.

### Katalog tuzilishi

Kurslar ikki guruhga bo'linadi (`courses.ts` dagi `kind`):

| Guruh | `kind` | Davomiylik | Misol |
|---|---|---|---|
| Kasblar | `profession` (standart) | oylarda (`months`) | Cisco / MikroTik tarmoqlar |
| Ko'nikmalar | `skill` | soatlarda (`hours`) | AI bilan dasturlash, SCS |

`hours` kiritilgan kursda kartada "20 soat", aks holda "3 oy" ko'rsatiladi. Daraja filtri ikkala guruhga ham ta'sir qiladi; bo'sh qolgan guruh sarlavhasi bilan birga yashiriladi.

### Tayyorlanayotgan kurslar

`courses.ts` da `status: 'soon'` qo'yilgan kurs — katalogda ko'rinadi, lekin:

- kartada "Tez orada" belgisi va "Batafsil" o'rniga "Xabar berish" tugmasi (forma shu kursni oldindan tanlaydi);
- batafsil sahifasi yo'q (slug so'ralsa 404), sitemap va `Course` JSON-LD ga tushmaydi;
- arizalar formasida alohida "Tez orada" guruhida — qiziqish bildirganlar Telegram'ga "(tez orada)" izohi bilan keladi.

Ishga tushirilganda: `status` ni olib tashlang → `course-details.ts` ga dastur qo'shing → `CourseDetail.<id>` matnlari → `priceFrom`.

### Ustozlar

`src/lib/mentors.ts` — ro'yxat bo'sh bo'lsa seksiya ko'rinmaydi. `lead: true` bo'lgan ustoz keng kartada (tarjimai hol, sertifikatlar, shaxsiy sayt) chiqadi, qolganlari 3 ustunli to'rda. Sertifikatlar faqat shaxsiy — markazning vendor akademiyasi maqomi (Cisco NetAcad, MikroTik Academy) sifatida yozilmaydi. Asoschi ma'lumoti `ORG.founder` da ham bor: footer havolasi va `EducationalOrganization.founder` JSON-LD shu yerdan oladi.

### Narxlar

Narx `courses.ts` dagi `priceFrom` maydonida — **oylik, so'mda**. Kiritilmagan kursda narx hech qayerda ko'rsatilmaydi (karta, kurs sahifasi, JSON-LD) — taxminiy raqam yozilmaydi.

- Kasb dasturlarida narx **oylik**, qisqa kurslarda (`kind: 'skill'`) — **kurs uchun to'liq**.
- Joriy narxlar ikki bosqichda aniqlangan: (1) ilm.uz ro'yxatidan 30% past, (2) O'zbekiston bozori bilan solishtirib tekshirilgan (oflayn IT kurslari ~790 000 – 2 190 000 so'm/oy). Manba va hisob `courses.ts` sarlavha izohida.
- Ko'rinishi: kartada `Courses.priceFrom` ("Oyiga 980 000 so'mdan") yoki `Courses.priceCourse` ("Kurs uchun 1 100 000 so'm"), kurs sahifasi meta panelida `Courses.priceValue`.
- Raqam `Intl` emas, `src/lib/price.ts` dagi `formatPrice()` bilan formatlanadi — brauzerlarda 'uz' lokali bo'lmagani uchun aks holda hydration xatosi chiqadi.
- schema.org: kasb dasturida `Offer` + `UnitPriceSpecification` (`unitCode: 'MON'`) — narx oylik ekani qidiruv tizimiga aniq aytiladi; qisqa kursda narx kurs uchun to'liq, shuning uchun `UnitPriceSpecification` qo'shilmaydi.

---

## Holat (2026-09-20)

**Tayyor:** to'liq bosh sahifa — Hero (terminal + typewriter), Texnologiyalar marquee, Courses (filtr + mavzu chiplari + formada avto-tanlash), WhyUs (6 afzallik), Stats, Process, Testimonials, FAQ (accordion + FAQPage JSON-LD), CTA banner, Contact (forma → api/send, xarita havolasi), Footer, suzuvchi Telegram tugmasi. SEO (dinamik OG, sitemap, robots, JSON-LD, hreflang), custom 404 + error sahifalar, favicon, @vercel/analytics + speed-insights, ESLint.

**⚠️ Tasdiqlash/almashtirish SHART (sayt jonli ishlayapti):**
- `messages/*.json` dagi **Testimonials.items** — NAMUNA matnlar. Haqiqiy bitiruvchilar fikrlari (rozilik bilan) bilan almashtiring.
- `src/lib/courses.ts` dagi kurs davomiyliklari (`months`) — placeholder.
- `messages/*.json` → **CourseDetail** — o'quv dasturlari sohaning joriy standartlari asosida yozilgan (CCNA 200-301, Linux/DevOps, Matter/Home Assistant, Claude Code / Codex 2026). Markazning real dasturiga moslab tekshiring. AI kurslari vositalari tez o'zgaradi — modullarni vaqti-vaqti bilan yangilang.
- **Narxlar:** `cisco`, `iptelephony`, `security`, `linux` — ilm.uz'dan 30% past qilib qo'yildi. `computer` va `iot` da ilm.uz'da ekvivalent yo'q — narx berilmagan, kartada ko'rsatilmaydi. Narxlar oylik deb belgilangan; ilm.uz raqamlari oylik emas, kurs uchun to'liq bo'lsa, `Courses.priceFrom`/`priceValue` matnlarini o'zgartirish kerak.
- Statistika raqamlari (50+ bitiruvchi, 5+ yil) — tasdiqlang.
- `src/lib/mentors.ts` — hozircha bitta yozuv: markaz asoschisi (ma'lumot o'z rezyumesidan, 2026-09). Boshqa ustozlar qo'shilganda seksiya avtomatik kengayadi; har biridan ma'lumot va rozilik olinishi shart.
- Statistika: `Stats` dagi "50+ bitiruvchi" va "5+ yil" hali tasdiqlanmagan (`src/components/sections/stats.tsx`).

---

## Brend logotipi

Logotip rasm emas, **vektor komponent**: `src/components/brand/logo.tsx`.

- Belgi — 45 nuqtadan iborat yaqinlashuvchi uchburchak (9 qator: 9→1). Geometriya rasmiy logotipdan o'lchab olingan va kodda qayta tiklangan.
- Rang `currentColor` orqali meros qilinadi — qorong'i mavzuda oq, yorug'da qora.
- Variantlar: `full` (navbar, footer, OG) va `compact` — pastki 5 qator, favicon/ilova ikonkalari uchun (kichik o'lchamda to'liq belgining yuqori nuqtalari subpiksel bo'lib yo'qoladi).

Ikonkalarni qayta generatsiya qilish kerak bo'lsa, manba — `src/app/icon.svg` (favicon) va undan olingan PNG'lar: `src/app/apple-icon.png`, `public/icons/icon-{192,512,512-maskable}.png`.
