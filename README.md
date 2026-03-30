# NETLAB — Vercel Deployment

## Loyiha strukturasi

```
netlab-vercel/
├── index.html        ← Sayt (frontend)
├── api/
│   └── send.js       ← Serverless function (Telegram proxy)
├── vercel.json       ← Vercel konfiguratsiyasi
├── .env.example      ← Environment variables namunasi
├── .gitignore        ← .env ni githubdan yashiradi
└── README.md
```

## Qanday ishlaydi?

```
Foydalanuvchi forma → /api/send (Vercel server) → Telegram API
                              ↑
                    Token faqat shu yerda (xavfsiz)
```

---

## Deploy qilish — bosqichma-bosqich

### 1. Vercel Environment Variables qo'shish

Vercel Dashboard → Your Project → Settings → Environment Variables:

| Name | Value |


### 2. GitHub ga push qiling

```bash
git add .
git commit -m "Secure Telegram proxy via Vercel Function"
git push
```

### 3. Vercel avtomatik deploy qiladi ✅

---

## Test qilish (local)

```bash
npm i -g vercel
vercel dev
```

Keyin: `http://localhost:3000` da forma ishlaydi.

---

## Muhim eslatmalar

- ❌ `.env` faylini hech qachon GitHub ga push qilmang
- ✅ Token faqat Vercel Environment Variables da saqlang
- ✅ Eski token kompromis bo'lganligi sababli yangi bot yarating yoki tokenni reset qiling:
  - @BotFather → /mybots → tokenni revoke qiling
