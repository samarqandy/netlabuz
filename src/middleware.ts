import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Minimal matcher: root redirect (/ -> /uz) va locale-prefiksli yo'llar.
  // Prefiksiz yo'llar (masalan /courses) bu yerda 404 beradi.
  matcher: ['/', '/(uz|ru|en)/:path*'],
};
