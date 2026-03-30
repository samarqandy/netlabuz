// api/send.js — Vercel Serverless Function
// Token bu yerda emas, Vercel Environment Variables da saqlanadi

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { name, phone, course, message, timestamp } = req.body;

        if (!name || name.trim().length < 2)
            return res.status(400).json({ ok: false, error: 'Ism kiritilmagan' });
        if (!phone || !/^\+?998[0-9]{9}$/.test(phone.replace(/\s/g, '')))
            return res.status(400).json({ ok: false, error: "Telefon noto'g'ri" });
        if (!course)
            return res.status(400).json({ ok: false, error: 'Kurs tanlanmagan' });

        const COURSE_NAMES = {
            'computer':    '💻 Kompyuter Savodxonligi',
            'cisco':       '🌐 Cisco / MikroTik Tarmoqlar',
            'iptelephony': '📞 IP-Telefoniya',
            'security':    '🛡️ Xavfsizlik & Video Nazorat',
            'linux':       '🐧 Linux Administratsiya',
            'iot':         '🏠 Aqlli Uy & IoT',
        };

        const tgMessage = `📩 *Yangi Ariza — NETLAB*\n\n👤 *Ism:* ${name.trim()}\n📞 *Telefon:* ${phone.replace(/\s/g, '')}\n📚 *Kurs:* ${COURSE_NAMES[course] || course}\n💬 *Izoh:* ${message?.trim() || '—'}\n⏰ *Vaqt:* ${timestamp || new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Samarkand' })}`;

        const TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TOKEN || !CHAT_ID)
            return res.status(500).json({ ok: false, error: 'Server konfiguratsiyasi xatosi' });

        const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage, parse_mode: 'Markdown', disable_web_page_preview: true }),
        });

        const tgData = await tgRes.json();
        if (!tgData.ok) throw new Error(tgData.description || 'Telegram xatosi');

        return res.status(200).json({ ok: true });

    } catch (err) {
        console.error('API xato:', err.message);
        return res.status(500).json({ ok: false, error: 'Yuborishda xatolik' });
    }
}
