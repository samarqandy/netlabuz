import Script from 'next/script';
import { gaId as getGaId, ymId as getYmId } from '@/lib/analytics-ids';

/**
 * GA4 (gtag.js) va Yandex Metrica (tag.js).
 * Konversiya hodisalari src/lib/track.ts orqali ikkalasiga ham yuboriladi;
 * Metrica'ning avtomatik maqsadlari (telefon, messenjer, forma) alohida ishlaydi.
 */
export function SiteAnalytics() {
  const ga = getGaId();
  const ym = getYmId();

  return (
    <>
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
      {ym && (
        <>
          <Script id="ym-init" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${ym}','ym');window.__ymId=${ym};ym(${ym},'init',{ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});`}
          </Script>
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${ym}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}
    </>
  );
}
