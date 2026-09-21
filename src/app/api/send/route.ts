import { NextResponse } from 'next/server';

// Telegram proxy — token va chat ID Vercel Environment Variables da saqlanadi.
// Eski api/send.js logikasi shu yerga ko'chirildi (xuddi shu env vars).

export const runtime = 'nodejs';

const COURSE_NAMES: Record<string, string> = {
  computer: '💻 Kompyuter Savodxonligi',
  cisco: '🌐 Cisco / MikroTik Tarmoqlar',
  iptelephony: '📞 IP-Telefoniya',
  security: '🛡️ Xavfsizlik & Video Nazorat',
  linux: '🐧 Linux Administratsiya',
  iot: '🏠 Aqlli Uy & IoT',
  // Tayyorlanayotgan yo'nalishlar — qiziqish bildirgan arizalar
  cybersecurity: '🔐 Kiberxavfsizlik (tez orada)',
  devops: '⚙️ DevOps va konteynerlar (tez orada)',
  windows: '🖥 Windows Server va Active Directory (tez orada)',
  cabling: '🔌 SKS — tarmoq kabellari (tez orada)',
  aicoding: '🤖 AI bilan dasturlash — Claude Code / Codex',
  aiops: '🧠 IT mutaxassisi uchun AI',
  aibasics: "✨ Sun'iy intellekt asoslari",
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: Request) {
  const headers = corsHeaders();

  try {
    const { name, phone, course, message, timestamp } = await req.json();

    // Validatsiya (eski send.js bilan bir xil)
    if (!name || String(name).trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: 'Ism kiritilmagan' },
        { status: 400, headers }
      );
    }
    if (!phone || !/^\+?998[0-9]{9}$/.test(String(phone).replace(/\s/g, ''))) {
      return NextResponse.json(
        { ok: false, error: "Telefon noto'g'ri" },
        { status: 400, headers }
      );
    }
    if (!course) {
      return NextResponse.json(
        { ok: false, error: 'Kurs tanlanmagan' },
        { status: 400, headers }
      );
    }

    const cleanName = String(name).trim();
    const cleanPhone = String(phone).replace(/\s/g, '');
    const courseLabel = COURSE_NAMES[course] || course;
    const when =
      timestamp ||
      new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Samarkand' });

    const tgMessage =
      `📩 *Yangi Ariza — NETLAB*\n\n` +
      `👤 *Ism:* ${cleanName}\n` +
      `📞 *Telefon:* ${cleanPhone}\n` +
      `📚 *Kurs:* ${courseLabel}\n` +
      `💬 *Izoh:* ${String(message || '').trim() || '—'}\n` +
      `⏰ *Vaqt:* ${when}`;

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { ok: false, error: 'Server konfiguratsiyasi xatosi' },
        { status: 500, headers }
      );
    }

    const tgRes = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: tgMessage,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
      }
    );

    const tgData = await tgRes.json();
    if (!tgData.ok) throw new Error(tgData.description || 'Telegram xatosi');

    return NextResponse.json({ ok: true }, { status: 200, headers });
  } catch (err) {
    console.error('API xato:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: 'Yuborishda xatolik' },
      { status: 500, headers }
    );
  }
}
