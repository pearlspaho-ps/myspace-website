import { useEffect, useState } from 'react';
import { css } from './lib/css.js';
import { loadPosts } from './lib/posts.js';
import { DISPLAY_NAME, NAV, PAGE_WORD, SEED_COMMENTS, SEED_GUESTS } from './data.js';
import Home from './pages/Home.jsx';
import Links from './pages/Links.jsx';
import Invite from './pages/Invite.jsx';
import Film from './pages/Film.jsx';
import Mail from './pages/Mail.jsx';
import Guestbook from './pages/Guestbook.jsx';
import Music from './pages/Music.jsx';
import Fortune from './pages/Fortune.jsx';
import { Letters, Bag } from './pages/Archived.jsx';

// Letters and Bag are archived: reachable only by typing #letters / #bag.
const PAGES = ['home', 'links', 'invite', 'photos', 'mail', 'guestbook', 'music', 'fortune', 'letters', 'bag'];
const pageFromHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '');
  return PAGES.includes(h) ? h : 'home';
};

export default function App() {
  const [page, setPageState] = useState(pageFromHash);
  const [popup, setPopup] = useState(null);
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [guests, setGuests] = useState(SEED_GUESTS);

  const setPage = (p) => {
    setPageState(p);
    const hash = p === 'home' ? '' : '#' + p;
    if (window.location.hash !== hash) history.pushState(null, '', hash || window.location.pathname);
  };

  useEffect(() => {
    const onPop = () => setPageState(pageFromHash());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    loadPosts('comments').then(c => { if (c.length) setComments(p => [...c.map((x, i) => ({ ...x, slot: 'ms-c-live-' + i })), ...p]); });
    loadPosts('guestbook').then(g => { if (g.length) setGuests(p => [...g.map(x => ({ ...x, accent: '#ff4fd8' })), ...p]); });
  }, []);

  return (
    <>
      {popup && (
        <div onClick={() => setPopup(null)} style={css('position:fixed;inset:0;background:rgba(27,13,46,0.6);display:flex;align-items:center;justify-content:center;z-index:900')}>
          <div role="dialog" style={css('width:330px;background:#eceff5;border:2px solid #7fa8e0;box-shadow:5px 5px 0 rgba(0,0,0,0.45)')}>
            <div style={css('background:linear-gradient(#4f8ce8,#1b5bbd);color:#fff;font-weight:bold;font-size:11px;padding:5px 8px;display:flex;justify-content:space-between')}>
              <span>message from pearl</span><span style={{ cursor: 'pointer' }}>x</span>
            </div>
            <div style={css("padding:22px 18px;text-align:center;font-family:'Comic Sans MS',cursive;font-size:19px;color:#a3127a")}>{popup}</div>
            <div style={css('padding:0 0 16px;text-align:center')}>
              <span style={css('display:inline-block;cursor:pointer;background:linear-gradient(#eee,#bbb);border:1px solid #777;padding:5px 22px;font-size:11px')}>OK</span>
            </div>
          </div>
        </div>
      )}

      <div style={css('min-height:100vh;padding:0 0 40px;font-family:Verdana,Geneva,sans-serif;font-size:11px;color:#1a1a1a;background-color:#1b0d2e;background-image:radial-gradient(circle at 6px 6px, rgba(255,255,255,0.55) 1px, transparent 1.6px),radial-gradient(circle at 26px 34px, rgba(255,120,220,0.7) 1.4px, transparent 2px),radial-gradient(circle at 44px 14px, rgba(110,247,255,0.55) 1px, transparent 1.6px),linear-gradient(#2a1147,#1b0d2e 60%,#0d0619);background-size:56px 56px,56px 56px,56px 56px,auto')}>

        <div style={css('background:linear-gradient(#4f8ce8,#1b5bbd 52%,#134a9e);border-bottom:2px solid #0b3474;padding:7px 0')}>
          <div style={css('width:1000px;margin:0 auto;display:flex;justify-content:space-between;align-items:center')}>
            <a href="/" onClick={(e) => { e.preventDefault(); setPage('home'); }} style={css('display:flex;align-items:baseline;gap:2px;text-decoration:none')}>
              <span style={css('font-family:Bungee,cursive;font-size:22px;color:#fff;letter-spacing:-0.02em;text-shadow:2px 2px 0 #0b3474')}>my</span>
              <span style={css('font-family:Bungee,cursive;font-size:22px;color:#ffe14d;letter-spacing:-0.02em;text-shadow:2px 2px 0 #0b3474')}>space</span>
            </a>
            <nav style={css('display:flex;gap:13px;font-size:10px;color:#fff')}>
              {NAV.map(n => {
                const on = n.page === page;
                return (
                  <a
                    key={n.label}
                    className="h-nav"
                    href={n.href || '#' + n.page}
                    target={n.href ? '_blank' : undefined}
                    rel={n.href ? 'noopener' : undefined}
                    onClick={(e) => { if (n.href) return; e.preventDefault(); setPage(n.page); }}
                    style={{ ...css('text-decoration:none;white-space:nowrap;cursor:pointer;padding-bottom:2px'), color: on ? '#ffe14d' : '#fff', borderBottom: '2px solid ' + (on ? '#ffe14d' : 'transparent') }}
                  >{n.label}</a>
                );
              })}
            </nav>
          </div>
        </div>

        <div style={css('width:1000px;margin:0 auto;padding:4px 0 10px;font-size:10px;color:#ffe14d;display:flex;justify-content:space-between;gap:16px;white-space:nowrap')}>
          <span>You are viewing <b style={{ color: '#fff' }}>{DISPLAY_NAME}</b>'s {PAGE_WORD[page] || 'profile'}</span>
          <span style={css('animation:blink 1s steps(1) infinite')}>★ 12 new comments! ★</span>
        </div>

        <div style={css('width:1000px;margin:0 auto 12px;background:linear-gradient(#ffe14d,#ffb400);border:2px solid #b37800;padding:8px 12px;overflow:hidden;white-space:nowrap;box-shadow:0 0 0 3px rgba(110,247,255,0.35)')}>
          <div style={css('display:inline-block;animation:marq 16s linear infinite;font-family:Silkscreen,monospace;font-size:13px;color:#6a2c00')}>✦ welcome 2 my space ✦ pls sign my guestbook ✦ turn ur sound ON ✦ i luv life ✦ no drama✦ notice me</div>
        </div>

        <main data-cat-area="1" style={css('width:1000px;margin:0 auto;background:#fdeef7;border:3px solid #ff4fd8;box-shadow:0 0 0 3px #6ef7ff,0 14px 40px rgba(0,0,0,0.55);padding:14px')}>
          {page === 'home' && <Home setPage={setPage} setPopup={setPopup} comments={comments} />}
          {page === 'fortune' && <Fortune />}
          {page === 'invite' && <Invite />}
          {page === 'links' && <Links />}
          {page === 'photos' && <Film />}
          {page === 'mail' && <Mail />}
          {page === 'letters' && <Letters />}
          {page === 'bag' && <Bag />}
          {page === 'guestbook' && <Guestbook guests={guests} />}
          {page === 'music' && <Music />}

          <div style={css('margin-top:14px;padding:10px;border-top:2px solid #ff4fd8;text-align:center;font-family:Silkscreen,monospace;font-size:10px;color:#5b2a86')}>
            best viewed in 1024×768 · <span style={css('animation:blink 1.2s steps(1) infinite')}>✦</span> thx 4 visiting my space <span style={css('animation:blink 1.2s steps(1) infinite')}>✦</span> · sign the guestbook plz
          </div>
        </main>
      </div>
    </>
  );
}
