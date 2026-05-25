import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import WizeShell from './WizeShell';
import { TripProvider } from './TripContext';

export const metadata: Metadata = {
 metadataBase: new URL('https://travel.wizelife.ai'),
 title: 'Cheap Flights & AI Travel Planner — Compare in Seconds | WizeTravel',
 description: 'Find cheap flights and build full trips with AI. Compare airlines, hotels and routes in 4 languages. Free to start.',
 alternates: { canonical: 'https://travel.wizelife.ai/' },
 openGraph: {
   type: 'website',
   url: 'https://travel.wizelife.ai/',
   title: 'Cheap Flights & AI Travel Planner — Compare in Seconds',
   description: 'Find cheap flights and build full trips with AI. Compare airlines, hotels and routes in 4 languages. Free to start.',
   images: [{ url: 'https://travel.wizelife.ai/og-image.png', width: 1200, height: 630 }],
   locale: 'en_US',
   alternateLocale: ['he_IL', 'pt_BR', 'es_ES'],
 },
 twitter: {
   card: 'summary_large_image',
   title: 'Cheap Flights & AI Travel Planner — Compare in Seconds',
   description: 'AI flight search & trip planning. 4 languages. Free to start.',
   images: ['https://travel.wizelife.ai/og-image.png'],
 },
 icons: { icon: '/icon-v2.png', apple: '/icon-v2.png' },
};

export const viewport: Viewport = {
 width: 'device-width',
 initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
 <html lang="en" dir="ltr" suppressHydrationWarning>
 <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"SoftwareApplication","name":"WizeTravel","applicationCategory":"TravelApplication","operatingSystem":"Any","url":"https://travel.wizelife.ai/","description":"AI flight search and travel planning.","creator":{"@type":"Organization","name":"WizeLife","url":"https://wizelife.ai/"},"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}})}} />
        <script dangerouslySetInnerHTML={{__html: "(function(){var T={en:'Cheap Flights & AI Travel Planner — Compare in Seconds | WizeTravel',he:'טיסות זולות ומתכנן טיולים AI — השוואה בשניות | WizeTravel',pt:'Voos Baratos e Planejador de Viagens IA — Compare em Segundos | WizeTravel',es:'Vuelos Baratos y Planificador de Viajes IA — Compara en Segundos | WizeTravel'};function s(){var l=(localStorage.getItem('wl_lang')||(navigator.language||'en').slice(0,2)||'en').toLowerCase();document.title=T[l]||T.en;}s();window.addEventListener('wl-lang-change',s);})();"}} />
 <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
 <Script id="wl-early-theme" strategy="beforeInteractive">{`
 try {
 var t = localStorage.getItem('wl_theme');
 var l = localStorage.getItem('wl_lang') || 'en';
 var de = document.documentElement;
 de.setAttribute('lang', l);
 de.setAttribute('dir', l === 'he' ? 'rtl' : 'ltr');
 de.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
 if (t === 'light') de.classList.add('light'); else de.classList.add('dark');
 } catch(e){}
 `}</Script>
 {/* Travelpayouts Drive — affiliate tracking. Loads emrld.ltd/NTI5NzI1.js (ID 529725). */}
 <Script
 id="travelpayouts-drive"
 src="https://emrld.ltd/NTI5NzI1.js?t=529725"
 strategy="afterInteractive"
 async
 />
 </head>
 <body suppressHydrationWarning>
 <TripProvider>
 <WizeShell>{children}</WizeShell>
 </TripProvider>
 <Analytics />
 <Script src="/wize-bottom-nav.js" strategy="afterInteractive" />
 <Script src="/wize-onboarding.js" strategy="afterInteractive" />
 <Script id="wize-quickstart-app" strategy="afterInteractive">{`window.WIZE_APP='travel';`}</Script>
 <Script src="https://wizelife.ai/js/wize-track-beacon.js" strategy="afterInteractive" />
 <Script id="wize-track-init" strategy="afterInteractive">{`(function(){var t=setInterval(function(){if(window.WizeTrack){clearInterval(t);WizeTrack.init('wizetravel');}},300);setTimeout(function(){clearInterval(t);},6000);})();`}</Script>
 <Script src="/wize-quickstart.js" strategy="afterInteractive" />
 <Script src="/wize-share.js" strategy="afterInteractive" />
 <Script src="/wize-hamburger.js" strategy="afterInteractive" />
 </body>
 </html>
 );
}
