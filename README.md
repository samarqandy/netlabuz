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

## Holat (2026-09-20)

**Tayyor:** to'liq bosh sahifa — Hero (terminal + typewriter), Texnologiyalar marquee, Courses (filtr + mavzu chiplari + formada avto-tanlash), WhyUs (6 afzallik), Stats, Process, Testimonials, FAQ (accordion + FAQPage JSON-LD), CTA banner, Contact (forma → api/send, xarita havolasi), Footer, suzuvchi Telegram tugmasi. SEO (dinamik OG, sitemap, robots, JSON-LD, hreflang), custom 404 + error sahifalar, favicon, @vercel/analytics + speed-insights, ESLint.

**⚠️ E'lon qilishdan oldin tasdiqlash/almashtirish SHART:**
- `messages/*.json` dagi **Testimonials.items** — NAMUNA matnlar. Haqiqiy bitiruvchilar fikrlari (rozilik bilan) bilan almashtiring.
- `src/lib/courses.ts` dagi kurs davomiyliklari (`months`) — placeholder.
- Narxlar qo'shilmagan (FAQ'da "konsultatsiyada aniqlanadi" deyilgan) — real narx qo'shish tavsiya etiladi (raqobatchilar shaffof narx ko'rsatadi).
- Statistika raqamlari (50+ bitiruvchi, 5+ yil) — tasdiqlang.
