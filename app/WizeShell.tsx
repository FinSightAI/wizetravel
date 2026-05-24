'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lang, t4 } from '@/lib/i18n';

const LOGO = 'https://wizelife.ai/assets/wizelife-icon.png';

type NavItem = {
  id: string;
  href: string;
  icon: ReactNode;
  labels: Record<Lang, string>;
  subItems?: { id: string; tab: string; labels: Record<Lang, string> }[];
};

const ICONS: Record<string, ReactNode> = {
  home: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  flights: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>),
  hotels: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M3 9h18v13H3z"/><path d="M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M9 14h6M9 18h6"/></svg>),
  deals: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
  ai: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/></svg>),
  destination: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>),
  tools: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>),
  watches: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><polyline points="7 14 11 10 15 14 21 8"/></svg>),
  trips: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  settings: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
};

const NAV: NavItem[] = [
  { id: 'home', href: '/', icon: ICONS.home, labels: { he: 'בית', en: 'Home', pt: 'Início', es: 'Inicio' } },
  {
    id: 'flights', href: '/flights', icon: ICONS.flights,
    labels: { he: 'טיסות', en: 'Flights', pt: 'Voos', es: 'Vuelos' },
    subItems: [
      { id: 'search', tab: 'search', labels: { he: '🔍 חיפוש Kiwi', en: '🔍 Kiwi Search', pt: '🔍 Busca', es: '🔍 Búsqueda' } },
      { id: 'flexible', tab: 'flexible', labels: { he: '📅 תאריכים גמישים', en: '📅 Flexible Dates', pt: '📅 Datas Flexíveis', es: '📅 Fechas Flexibles' } },
      { id: 'calendar', tab: 'calendar', labels: { he: '📆 לוח מחירים', en: '📆 Price Calendar', pt: '📆 Calendário', es: '📆 Calendario' } },
      { id: 'hidden', tab: 'hidden', labels: { he: '🕵️ Hidden City', en: '🕵️ Hidden City', pt: '🕵️ Hidden City', es: '🕵️ Hidden City' } },
      { id: 'positioning', tab: 'positioning', labels: { he: '🗺️ Positioning', en: '🗺️ Positioning', pt: '🗺️ Positioning', es: '🗺️ Positioning' } },
      { id: 'stopovers', tab: 'stopovers', labels: { he: '🔁 עצירות חינם', en: '🔁 Free Stopovers', pt: '🔁 Escalas', es: '🔁 Escalas' } },
      { id: 'multicity', tab: 'multicity', labels: { he: '🌍 מסלול מרובה', en: '🌍 Multi-city', pt: '🌍 Multi-cidade', es: '🌍 Multi-ciudad' } },
    ],
  },
  { id: 'hotels', href: '/hotels', icon: ICONS.hotels, labels: { he: 'מלונות', en: 'Hotels', pt: 'Hotéis', es: 'Hoteles' } },
  {
    id: 'destination', href: '/destination', icon: ICONS.destination,
    labels: { he: 'מדריך יעד', en: 'Destination', pt: 'Destino', es: 'Destino' },
    subItems: [
      { id: 'wheretogo', tab: 'wheretogo', labels: { he: '🌍 איפה כדאי לטוס?', en: '🌍 Where to Go?', pt: '🌍 Para Onde?', es: '🌍 Adónde?' } },
      { id: 'compare', tab: 'compare', labels: { he: '🆚 השוואת יעדים', en: '🆚 Compare', pt: '🆚 Comparar', es: '🆚 Comparar' } },
      { id: 'weather', tab: 'weather', labels: { he: '🌤️ מזג אוויר', en: '🌤️ Weather', pt: '🌤️ Clima', es: '🌤️ Clima' } },
      { id: 'events', tab: 'events', labels: { he: '🎭 אירועים', en: '🎭 Events', pt: '🎭 Eventos', es: '🎭 Eventos' } },
    ],
  },
  {
    id: 'deals', href: '/deals', icon: ICONS.deals,
    labels: { he: 'דילים', en: 'Deals', pt: 'Ofertas', es: 'Ofertas' },
    subItems: [
      { id: 'hunter', tab: 'hunter', labels: { he: '🔥 ציד דילים', en: '🔥 Deal Hunter', pt: '🔥 Caçador', es: '🔥 Cazador' } },
      { id: 'expiring', tab: 'expiring', labels: { he: '⏰ דילים שפגים', en: '⏰ Expiring', pt: '⏰ Expirando', es: '⏰ Expirando' } },
      { id: 'insights', tab: 'insights', labels: { he: '🤖 תובנות AI', en: '🤖 AI Insights', pt: '🤖 Insights IA', es: '🤖 Insights IA' } },
      { id: 'patterns', tab: 'patterns', labels: { he: '📊 דפוסי DB', en: '📊 DB Patterns', pt: '📊 Padrões', es: '📊 Patrones' } },
      { id: 'competitor', tab: 'competitor', labels: { he: '🔍 השוואת אתרים', en: '🔍 Site Compare', pt: '🔍 Comparar', es: '🔍 Comparar' } },
      { id: 'rss', tab: 'rss', labels: { he: '📡 RSS & Reddit', en: '📡 RSS & Reddit', pt: '📡 RSS & Reddit', es: '📡 RSS & Reddit' } },
    ],
  },
  {
    id: 'ai', href: '/ai', icon: ICONS.ai,
    labels: { he: 'AI', en: 'AI', pt: 'IA', es: 'IA' },
    subItems: [
      { id: 'chat', tab: 'chat', labels: { he: '💬 סוכן AI', en: '💬 AI Agent', pt: '💬 Agente IA', es: '💬 Agente IA' } },
      { id: 'plan', tab: 'plan', labels: { he: '🗺️ תכנן טיול', en: '🗺️ Plan Trip', pt: '🗺️ Planeje', es: '🗺️ Planifica' } },
      { id: 'predict', tab: 'predict', labels: { he: '📈 חיזוי מחיר', en: '📈 Predict', pt: '📈 Prever', es: '📈 Predecir' } },
      { id: 'wait', tab: 'wait', labels: { he: '🔮 כדאי לחכות?', en: '🔮 Wait or Buy?', pt: '🔮 Esperar?', es: '🔮 Esperar?' } },
      { id: 'surprise', tab: 'surprise', labels: { he: '🎲 יעד מפתיע', en: '🎲 Surprise', pt: '🎲 Surpresa', es: '🎲 Sorpresa' } },
      { id: 'opps', tab: 'opps', labels: { he: '🌟 הזדמנויות AI', en: '🌟 AI Opps', pt: '🌟 Oportunidades', es: '🌟 Oportunidades' } },
      { id: 'sentiment', tab: 'sentiment', labels: { he: '📰 סנטימנט', en: '📰 Sentiment', pt: '📰 Sentimento', es: '📰 Sentimiento' } },
      { id: 'dna', tab: 'dna', labels: { he: '🧬 Price DNA', en: '🧬 Price DNA', pt: '🧬 DNA Preços', es: '🧬 ADN Precios' } },
    ],
  },
  {
    id: 'tools', href: '/tools', icon: ICONS.tools,
    labels: { he: 'כלים חכמים', en: 'Smart Tools', pt: 'Ferramentas', es: 'Herramientas' },
    subItems: [
      { id: 'visa', tab: 'visa', labels: { he: '🛂 בדיקת ויזה', en: '🛂 Visa Check', pt: '🛂 Visto', es: '🛂 Visa' } },
      { id: 'fx', tab: 'fx', labels: { he: '💱 שערי חליפין', en: '💱 Exchange', pt: '💱 Câmbio', es: '💱 Cambio' } },
      { id: 'truecost', tab: 'truecost', labels: { he: '💰 עלות אמיתית', en: '💰 True Cost', pt: '💰 Custo Real', es: '💰 Costo Real' } },
      { id: 'points', tab: 'points', labels: { he: '💳 נקודות vs מזומן', en: '💳 Points vs Cash', pt: '💳 Pontos', es: '💳 Puntos' } },
    ],
  },
  { id: 'trips', href: '/trips', icon: ICONS.trips, labels: { he: '⭐ הטיולים שלי', en: '⭐ My Trips', pt: '⭐ Minhas Viagens', es: '⭐ Mis Viajes' } },
  { id: 'watches', href: '/watches', icon: ICONS.watches, labels: { he: '📊 מעקב מחירים', en: '📊 Price Watches', pt: '📊 Monitorar', es: '📊 Seguimiento' } },
  {
    id: 'settings', href: '/settings', icon: ICONS.settings,
    labels: { he: 'הגדרות', en: 'Settings', pt: 'Configurações', es: 'Configuración' },
    subItems: [
      { id: 'general', tab: 'general', labels: { he: '⚙️ כלליים', en: '⚙️ General', pt: '⚙️ Geral', es: '⚙️ General' } },
      { id: 'alerts', tab: 'alerts', labels: { he: '🎯 התראות', en: '🎯 Alerts', pt: '🎯 Alertas', es: '🎯 Alertas' } },
      { id: 'telegram', tab: 'telegram', labels: { he: '🤖 Telegram', en: '🤖 Telegram', pt: '🤖 Telegram', es: '🤖 Telegram' } },
      { id: 'whatsapp', tab: 'whatsapp', labels: { he: '💬 WhatsApp', en: '💬 WhatsApp', pt: '💬 WhatsApp', es: '💬 WhatsApp' } },
      { id: 'autobook', tab: 'autobook', labels: { he: '⚡ Auto-Book', en: '⚡ Auto-Book', pt: '⚡ Auto-Book', es: '⚡ Auto-Book' } },
    ],
  },
];

const FOOTER_SUB: Record<Lang, string> = {
  he: 'מתכנן AI לטיולים',
  en: 'AI Travel Planner',
  pt: 'Planejador IA',
  es: 'Planificador IA',
};

type SSO = { token?: string; email?: string; uid?: string; nick?: string; plan?: 'free' | 'pro' | 'yolo' };

export default function WizeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [rpCollapsed, setRpCollapsed] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [lang, setLangState] = useState<Lang>('en');
  // Keep document dir in sync with the language on EVERY change (incl. the
  // initial URL/storage/browser resolution — not just manual switches), so
  // EN/PT/ES never render in a mirrored RTL layout.
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);
  const [fxRates, setFxRates] = useState<Record<string, number> | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [sso, setSso] = useState<SSO | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Close mobile drawer on every route change
    setMobileNavOpen(false);
    // ── SSO bridge: read wl_token + wl_nick + wl_plan from URL ──
    try {
      const p = new URLSearchParams(window.location.search);
      const wlToken = p.get('wl_token');
      const wlNick = p.get('wl_nick');
      const wlPlan = p.get('wl_plan');
      if (wlToken || wlNick || wlPlan) {
        const existing = JSON.parse(localStorage.getItem('wl_sso') || '{}');
        if (wlToken) {
          existing.token = wlToken;
          try {
            const payload = JSON.parse(atob(wlToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload.email) existing.email = payload.email;
            if (payload.user_id) existing.uid = payload.user_id;
          } catch {}
        }
        if (wlNick) existing.nick = decodeURIComponent(wlNick);
        if (wlPlan && ['free','pro','yolo'].includes(wlPlan)) existing.plan = wlPlan;
        localStorage.setItem('wl_sso', JSON.stringify(existing));
        if (wlNick) localStorage.setItem('wl_nickname', decodeURIComponent(wlNick));
        if (wlPlan) localStorage.setItem('wl_plan', wlPlan);
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('wl_token');
        url.searchParams.delete('wl_nick');
        url.searchParams.delete('wl_plan');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}

    // Load SSO state
    try {
      const s = JSON.parse(localStorage.getItem('wl_sso') || '{}');
      const plan = (localStorage.getItem('wl_plan') as 'free'|'pro'|'yolo'|null) || s.plan || 'free';
      setSso({ ...s, plan });
    } catch {}

    // Unified language resolution (same across all WizeLife apps):
    // URL ?lang (cross-app handoff from WizeLife) → saved wl_lang → browser → English.
    const VALID = ['he','en','pt','es'] as const;
    const urlLang = (new URLSearchParams(window.location.search).get('lang') || '') as Lang;
    const stored = (localStorage.getItem('wl_lang') as Lang | null);
    let resolved: Lang;
    if (urlLang && VALID.includes(urlLang)) resolved = urlLang;
    else if (stored && VALID.includes(stored)) resolved = stored;
    else { resolved = 'en'; }
    setLangState(resolved);
    try { localStorage.setItem('wl_lang', resolved); } catch {}
    if (localStorage.getItem('wl_rp_collapsed') === '1') setRpCollapsed(true);
    const t = document.documentElement.getAttribute('data-theme') || document.body.className;
    setIsLight(t.includes('light'));

    // Restore open groups
    try {
      const saved = JSON.parse(localStorage.getItem('wl_tr_open_groups') || '{}');
      // Auto-open the group matching current path
      const active = pathname === '/' ? 'home' : pathname.replace(/^\//, '').split('/')[0];
      saved[active] = true;
      setOpenGroups(saved);
    } catch {}

    fetch((process.env.NEXT_PUBLIC_API_BASE || 'https://ofirofir-wizetravel.hf.space') + '/api/exchange-rates')
      .then(r => r.json())
      .then(d => setFxRates(d?.rates || null))
      .catch(() => {});
  }, [pathname]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('wl_lang', l);
    document.documentElement.setAttribute('lang', l);
    document.documentElement.setAttribute('dir', l === 'he' ? 'rtl' : 'ltr');
  };

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('wl_tr_open_groups', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isRtl = lang === 'he';
  const active = pathname === '/' ? 'home' : pathname.replace(/^\//, '').split('/')[0];

  return (
    <>
      {/* App's own mobile hamburger → opens the WizeTravel nav sidebar as a drawer.
          `mobile-menu-toggle` makes the shared wize-hamburger.js skip its button. */}
      <button className="mobile-menu-toggle wl-tr-ham" aria-label="Menu" onClick={() => setMobileNavOpen(o => !o)}>☰</button>
      {mobileNavOpen && <div className="wl-tr-ham-ov" onClick={() => setMobileNavOpen(false)} />}
      <div className="wl-bar">
        <a href="https://wizelife.ai">
          <img src={LOGO} alt="WizeLife" style={{ width: 22, height: 22 }} />
          <span style={{ fontWeight: 800 }}>WizeLife</span>
          <span className="brand-pill">WizeTravel</span>
        </a>
        <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Plan badge — only show for non-free plans */}
          {sso?.plan && sso.plan !== 'free' && (
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 0.4,
              padding: '3px 9px', borderRadius: 99, whiteSpace: 'nowrap',
              background: sso.plan === 'yolo' ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))'
                        : sso.plan === 'pro'  ? 'rgba(16,185,129,0.18)'
                        :                       'rgba(99,102,241,0.15)',
              color: sso.plan === 'yolo' ? '#fbbf24' : sso.plan === 'pro' ? '#34d399' : '#a5b4fc',
              border: '1px solid ' + (sso.plan === 'yolo' ? 'rgba(245,158,11,0.35)'
                                    : sso.plan === 'pro'  ? 'rgba(16,185,129,0.35)'
                                    :                       'rgba(99,102,241,0.25)'),
            }}>
              {sso.plan === 'yolo' ? '⚡ YOLO' : sso.plan === 'pro' ? '✦ PRO' : 'FREE'}
            </span>
          )}

          {/* Display name / account status (prefer name over email) */}
          {sso?.email && (() => {
            let displayName = (sso.nick && sso.nick.trim())
              || (sso.email.includes('@') ? sso.email.split('@')[0] : sso.email);
            // First name only
            if (displayName && /\s/.test(displayName)) displayName = displayName.split(/\s+/)[0];
            const shown = displayName.length > 18 ? displayName.slice(0, 16) + '…' : displayName;
            return (
              <span title={sso.email} style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap',
                background: 'rgba(16,185,129,0.12)', color: '#34d399',
                border: '1px solid rgba(16,185,129,0.3)',
                maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                ✓ {shown}
              </span>
            );
          })()}

          {/* Sign-in link if no SSO */}
          {!sso?.email && (
            <a href="https://wizelife.ai/auth.html" style={{
              fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 99,
              background: 'rgba(245,158,11,0.12)', color: '#fbbf24',
              border: '1px solid rgba(245,158,11,0.3)', textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              {t4(lang, { he: 'התחבר', en: 'Sign in', pt: 'Entrar', es: 'Entrar' })}
            </a>
          )}

          <div className="lang-pills">
            {(['en', 'es', 'pt', 'he'] as Lang[]).map(l => (
              <button key={l} className={`lang-pill ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wl-shell" style={{ display: 'flex', minHeight: 'calc(100vh - 36px)' }}>
        <aside className={'wl-tr-sidebar' + (mobileNavOpen ? ' wl-tr-sidebar-open' : '')} style={{
          width: 240, flexShrink: 0,
          background: isLight ? '#ffffff' : '#060810',
          borderInlineEnd: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.07)',
          padding: '16px 10px',
          display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 36px)', overflowY: 'auto', position: 'sticky', top: 36,
        }}>
          <div style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
            color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)',
            padding: '0 10px 12px',
          }}>
            {lang === 'he' ? 'ניווט' : lang === 'pt' ? 'Navegação' : lang === 'es' ? 'Navegación' : 'Navigation'}
          </div>

          {NAV.map(item => {
            const isActive = active === item.id;
            const hasSubs = !!item.subItems?.length;
            const isOpen = !!openGroups[item.id];
            return (
              <div key={item.id} style={{ marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <Link href={item.href} className="wl-tr-nav-item" style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8,
                    fontSize: 13, fontWeight: 600,
                    color: isActive ? '#06b6d4' : (isLight ? '#475569' : '#94a3b8'),
                    background: isActive ? (isLight ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.12)') : 'transparent',
                    border: isActive ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
                    transition: 'all .15s',
                  }}>
                    <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                    <span>{item.labels[lang]}</span>
                  </Link>
                  {hasSubs && (
                    <button
                      onClick={() => toggleGroup(item.id)}
                      aria-label="Expand"
                      style={{
                        width: 24, height: 24, padding: 0, marginInlineStart: 2,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: isLight ? '#94a3b8' : '#64748b', fontSize: 10,
                        transform: isOpen ? 'rotate(0deg)' : (isRtl ? 'rotate(90deg)' : 'rotate(-90deg)'),
                        transition: 'transform 0.2s',
                      }}>▾</button>
                  )}
                </div>

                {hasSubs && isOpen && (
                  <div style={{ marginInlineStart: 22, marginTop: 2, marginBottom: 6, borderInlineStart: '1px solid ' + (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'), paddingInlineStart: 8 }}>
                    {item.subItems!.map(sub => (
                      <Link
                        key={sub.id}
                        href={`${item.href}?tab=${sub.tab}`}
                        style={{
                          display: 'block',
                          padding: '6px 10px',
                          fontSize: 12,
                          color: isLight ? '#64748b' : '#94a3b8',
                          borderRadius: 6,
                          textDecoration: 'none',
                          transition: 'all .15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.08)'; e.currentTarget.style.color = '#67e8f9'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isLight ? '#64748b' : '#94a3b8'; }}
                      >
                        {sub.labels[lang]}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && (window as typeof window & { WizeShare?: { share: (o: Record<string,string>) => void } }).WizeShare) {
                (window as typeof window & { WizeShare: { share: (o: Record<string,string>) => void } }).WizeShare.share({
                  title: document.title,
                  text: 'WizeTravel — AI trip planning',
                  url: location.href,
                });
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8, marginBottom: 2,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              color: isLight ? '#475569' : '#94a3b8',
              background: 'transparent', border: '1px solid transparent',
              transition: 'all .15s', width: '100%', textAlign: 'start',
            }}
          >
            <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>↗️</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
              {t4(lang, { he: 'שתף', en: 'Share', pt: 'Compartilhar', es: 'Compartir' })}
            </span>
          </button>
          <div style={{ flex: 1 }} />
          <div style={{
            padding: '12px 10px', borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.07)',
            fontSize: 11, color: isLight ? '#475569' : '#6b7280',
          }}>
            <strong style={{ color: isLight ? '#1e293b' : '#eef2ff', display: 'block', marginBottom: 2 }}>WizeTravel</strong>
            {FOOTER_SUB[lang]}
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0, padding: '24px 32px', overflowY: 'auto' }}>
          {children}
        </main>

        {!rpCollapsed && (
          <aside className="wl-tr-rpanel" style={{
            width: 240, flexShrink: 0,
            background: isLight ? '#ffffff' : '#060810',
            borderInlineStart: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.07)',
            padding: '16px',
            display: 'flex', flexDirection: 'column', gap: 14,
            height: 'calc(100vh - 36px)', overflowY: 'auto', position: 'sticky', top: 36,
          }}>
            <button onClick={() => { setRpCollapsed(true); localStorage.setItem('wl_rp_collapsed', '1'); }}
              aria-label="Collapse"
              style={{
                position: 'absolute', top: 10, [isRtl ? 'right' : 'left']: 10,
                width: 24, height: 24, borderRadius: 6,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8', cursor: 'pointer', fontSize: 14, padding: 0, fontFamily: 'inherit',
              }}>×</button>
            <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12, fontWeight: 800, color: isLight ? '#1e293b' : '#eef2ff', marginBottom: 4 }}>
              {lang === 'he' ? 'תובנות' : 'Insights'}
            </div>
            <div style={{
              background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
              border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: 12,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                {lang === 'he' ? 'טיפים מהירים' : 'Quick Tips'}
              </div>
              {(lang === 'he' ? [
                'טיסות באמצע השבוע (ג\'-ד\') זולות יותר',
                'הזמנה 6-8 שבועות מראש = הכי משתלם',
                'בדוק hidden-city — לפעמים 30% פחות',
              ] : lang === 'pt' ? ['Voos meio de semana mais baratos', 'Reserve 6-8 semanas antes', 'Cidade oculta — economize 30%']
              : lang === 'es' ? ['Vuelos entre semana más baratos', 'Reserva 6-8 semanas antes', 'Ciudad oculta — ahorra 30%']
              : ['Mid-week flights (Tue-Wed) are cheaper', 'Book 6-8 weeks ahead for best prices', 'Check hidden-city deals — sometimes 30% off']).map((t, i, arr) => (
                <div key={i} style={{ fontSize: 11.5, color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.55, padding: '8px 0', borderBottom: i < arr.length - 1 ? (isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.04)') : 'none' }}>
                  {t}
                </div>
              ))}
            </div>
            {fxRates && (
              <div style={{
                background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 12,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
                  {lang === 'he' ? 'שערי חליפין' : lang === 'pt' ? 'Taxas de Câmbio' : lang === 'es' ? 'Tipos de Cambio' : 'Exchange Rates'}
                </div>
                <div style={{ fontSize: 9, color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                  {lang === 'he' ? '1 USD שווה ל-' : lang === 'pt' ? '1 USD equivale a' : lang === 'es' ? '1 USD equivale a' : '1 USD equals'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['ILS', 'EUR', 'GBP', 'BRL'].filter(c => fxRates[c]).map(c => (
                    <div key={c} style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                      <strong style={{ color: isLight ? '#1e293b' : '#eef2ff' }}>{fxRates[c].toFixed(2)}</strong>
                      <span style={{ color: isLight ? '#94a3b8' : '#6b7280', marginInlineStart: 4 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
        {rpCollapsed && (
          <button onClick={() => { setRpCollapsed(false); localStorage.setItem('wl_rp_collapsed', '0'); }}
            aria-label="Open"
            style={{
              position: 'fixed', top: '50%',
              [isRtl ? 'left' : 'right']: 0, transform: 'translateY(-50%)',
              width: 24, height: 60,
              borderRadius: isRtl ? '0 8px 8px 0' : '8px 0 0 8px',
              background: 'rgba(6,182,212,0.18)', border: '1px solid rgba(6,182,212,0.3)',
              [isRtl ? 'borderLeft' : 'borderRight']: 'none',
              color: '#67e8f9', cursor: 'pointer', fontSize: 14, lineHeight: '60px',
              textAlign: 'center', padding: 0, zIndex: 51, fontFamily: 'inherit',
            }}>{isRtl ? '‹' : '›'}</button>
        )}
      </div>

      <style>{`
        .wl-tr-nav-item:hover { background: rgba(6,182,212,0.08) !important; color: #67e8f9 !important; }
        .wl-tr-nav-item { overflow: hidden; }
        .wl-tr-nav-item > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
        @media (max-width: 1100px) { .wl-tr-rpanel { display: none !important; } }
        .wl-tr-ham { display: none; }
        .wl-tr-ham-ov { position: fixed; inset: 0; z-index: 100002; background: rgba(0,0,0,0.5); -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px); }
        @media (max-width: 768px) {
          main { padding: 16px !important; }
          .wl-tr-ham { display: flex; position: fixed; top: calc(1px + env(safe-area-inset-top)); left: auto; right: 8px; z-index: 100001; width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #eef2ff; font-size: 18px; line-height: 1; align-items: center; justify-content: center; cursor: pointer; -webkit-tap-highlight-color: transparent; }
          html[dir="rtl"] .wl-tr-ham { right: auto; left: 8px; }
          .wl-tr-sidebar { position: fixed !important; top: 36px !important; bottom: 0 !important; left: 0; right: auto; width: 240px; overflow: hidden; height: auto !important; z-index: 100003; transform: translateX(-100%); transition: transform .28s ease; }
          html[dir="rtl"] .wl-tr-sidebar { left: auto; right: 0; transform: translateX(100%); }
          .wl-tr-sidebar.wl-tr-sidebar-open { transform: translateX(0) !important; }
        }
      `}</style>
    </>
  );
}
