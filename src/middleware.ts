import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // api, _next/_vercel ichki yo'llari va statik fayllardan (nuqtali)
  // tashqari hamma yo'l middleware orqali o'tadi — prefiksiz yo'llar
  // default tilga redirect bo'lib, so'ng [...rest] catch-all 404 beradi.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
