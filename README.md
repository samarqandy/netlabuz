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

---

## Holat (2026-09-20)

**Tayyor:** to'liq bosh sahifa — Hero (terminal + typewriter), Texnologiyalar marquee, Courses (filtr + mavzu chiplari + formada avto-tanlash), WhyUs (6 afzallik), Stats, Process, Testimonials, FAQ (accordion + FAQPage JSON-LD), CTA banner, Contact (forma → api/send, xarita havolasi), Footer, suzuvchi Telegram tugmasi. SEO (dinamik OG, sitemap, robots, JSON-LD, hreflang), custom 404 + error sahifalar, favicon, @vercel/analytics + speed-insights, ESLint.

**⚠️ Tasdiqlash/almashtirish SHART (sayt jonli ishlayapti):**
- `messages/*.json` dagi **Testimonials.items** — NAMUNA matnlar. Haqiqiy bitiruvchilar fikrlari (rozilik bilan) bilan almashtiring.
- `src/lib/courses.ts` dagi kurs davomiyliklari (`months`) — placeholder.
- `messages/*.json` → **CourseDetail** — o'quv dasturlari sohaning joriy standartlari asosida yozilgan (CCNA 200-301, Linux/DevOps, Matter/Home Assistant). Markazning real dasturiga moslab tekshiring.
- Narxlar qo'shilmagan (FAQ'da "konsultatsiyada aniqlanadi" deyilgan) — real narx qo'shish tavsiya etiladi (raqobatchilar shaffof narx ko'rsatadi).
- Statistika raqamlari (50+ bitiruvchi, 5+ yil) — tasdiqlang.
- `src/lib/mentors.ts` bo'sh — ustozlar ma'lumoti qo'shilsa, seksiya avtomatik paydo bo'ladi.
