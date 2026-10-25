/**
 * IndexNow — yangilangan sahifalarni qidiruv tizimlariga darhol bildiradi.
 *
 * Yandex va Bing bu protokolni qo'llab-quvvatlaydi: odatda sahifa
 * haftalab kutadigan indeksatsiya soatlarga tushadi. Google IndexNow'ni
 * qo'llab-quvvatlamaydi — unga sitemap va Search Console orqali boradi.
 *
 * Kalit `public/<kalit>.txt` faylida turadi va saytdan ochiq o'qiladi —
 * protokol shuni talab qiladi (egalikni shu bilan tasdiqlaydi).
 *
 * Ishlatish:  node scripts/indexnow.mjs
 * Deploy'dan keyin qo'lda yurgiziladi yoki CI'ga qo'shiladi.
 */
const KEY = 'ced51af4fceed6a4844de13599d2e4d8';
const HOST = 'netlab.uz';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

const res = await fetch(`https://${HOST}/sitemap.xml`);
if (!res.ok) throw new Error(`sitemap o'qilmadi: ${res.status}`);
const xml = await res.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error('sitemap bo\'sh');

const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls };
const out = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
console.log(`IndexNow: ${urls.length} ta URL yuborildi → HTTP ${out.status}`);
if (out.status >= 400) console.error(await out.text());
