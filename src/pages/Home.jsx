import { useState } from 'react';
import { css } from '../lib/css.js';
import { submitPost, postResultMessage } from '../lib/posts.js';
import Photo from '../Photo.jsx';
import Player from '../Player.jsx';
import { DISPLAY_NAME, FIRST_NAME, MOOD, LAST_LOGIN, INTERESTS, FRIENDS, FRIEND_BORDERS, GOODREADS_URL } from '../data.js';

const pinkHead = 'background:linear-gradient(#ff7ae0,#e0169b);border:1px solid #9c0e6b;color:#fff;font-weight:bold;font-size:11px;padding:4px 7px';
const blueHead = 'background:linear-gradient(#4f8ce8,#1b5bbd);border:1px solid #0b3474;color:#fff;font-weight:bold;font-size:11px;padding:4px 7px';

export default function Home({ setPage, setPopup, comments }) {
  const contactBtns = [
    { icon: '✉', label: 'Send Message', act: () => setPage('mail') },
    { icon: '☆', label: 'Add to Friends', act: () => setPopup('i love you too ♡') },
    { icon: '⚠', label: 'Block User', act: () => setPopup('i hate you too') },
    { icon: '✍', label: 'Sign Guestbook', act: () => setPage('guestbook') }
  ];

  return (
    <div style={css('display:grid;grid-template-columns:300px 1fr;gap:16px;align-items:start')}>

      <div style={css('display:flex;flex-direction:column;gap:14px')}>

        <div style={{ textAlign: 'center' }}>
          <h1 style={css('margin:0;font-weight:normal;font-family:Bungee,cursive;font-size:26px;line-height:1.05;color:#e0169b;animation:glow 3.5s ease-in-out infinite')}>{DISPLAY_NAME}</h1>
          <div style={css('font-family:Silkscreen,monospace;font-size:10px;color:#5b2a86;margin-top:4px')}>☆ left brained · atheist · philomath ☆</div>
        </div>

        <div style={css('position:relative;border:6px double #ff4fd8;padding:5px;background:#fff')}>
          <div style={css('position:relative;width:100%;aspect-ratio:4/5;background:#ded4c2')}><Photo slot="ms-pfp" alt="pearl" aspect={4 / 5} /></div>
          <div style={css('position:absolute;right:-8px;top:-10px;transform:rotate(9deg);background:#6ef7ff;border:2px solid #0a6d78;font-family:Silkscreen,monospace;font-size:9px;padding:3px 5px;animation:bob 2.6s ease-in-out infinite')}>Hi : P</div>
        </div>

        <div style={css('border:1px solid #999;background:#f2f2f2;padding:6px 8px;font-size:10px;line-height:1.7')}>
          <div><span style={css('color:#e0169b;font-weight:bold')}>✎ mood:</span> {MOOD}</div>
          <div><b>Last login:</b> {LAST_LOGIN}</div>
          <div style={css('display:flex;align-items:center;gap:5px;margin-top:3px')}>
            <span style={css('width:8px;height:8px;border-radius:50%;background:#2ecc40;box-shadow:0 0 5px #2ecc40;animation:blink 1.4s steps(1) infinite')}></span>
            <b style={{ color: '#0a7a1a' }}>Online Now!</b>
          </div>
        </div>

        <div>
          <div style={css(blueHead)}>Contacting {FIRST_NAME}</div>
          <div style={css('border:1px solid #7fa8e0;border-top:none;background:#eaf2ff;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px')}>
            {contactBtns.map(b => (
              <div key={b.label} className="h-yb" onClick={b.act} role="button" style={css('display:flex;align-items:center;gap:5px;background:#fff;border:1px solid #a9c6ec;padding:5px 6px;font-size:10px;cursor:pointer')}>
                <span style={{ fontSize: 12 }}>{b.icon}</span><span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div data-cat-hide="1" style={css('position:relative;z-index:3')}>
          <div style={css(pinkHead)}>{FIRST_NAME}'s Interests</div>
          <div style={css('border:1px solid #f0a5dc;border-top:none;background:#fff')}>
            {INTERESTS.map(row => (
              <div key={row.k} style={css('display:grid;grid-template-columns:78px 1fr;border-bottom:1px solid #f6ddef')}>
                <div style={css('background:#f7cfe8;padding:6px;font-weight:bold;color:#8c0f68;font-size:10px')}>{row.k}</div>
                <div style={css('padding:6px;line-height:1.6;font-size:10px')}>{row.v}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={css('display:flex;flex-direction:column;gap:16px')}>

        <Player />

        <div>
          <div style={css(pinkHead)}>About me:</div>
          <div style={css('border:1px solid #f0a5dc;border-top:none;background:#fff;padding:11px;line-height:1.85;font-size:11px')}>
            hi, welcome to my space. i like to walk places, i like to play with my friends, and i love to love
            <div style={{ marginTop: 9 }}><b>who i'd like to meet:</b> people who are cool, opinionated people, funny people</div>
          </div>
        </div>

        <div>
          <div style={{ ...css(blueHead), ...css('display:flex;justify-content:space-between;gap:12px;white-space:nowrap') }}>
            <span>{FIRST_NAME}'s Friend Space</span><span style={{ fontWeight: 'normal' }}>4 friends</span>
          </div>
          <div style={css('border:1px solid #7fa8e0;border-top:none;background:#eaf2ff;padding:10px')}>
            <div style={css('font-size:10px;margin-bottom:8px')}>{FIRST_NAME} has <b>8</b> friends. Displaying <b>4</b> of them.</div>
            <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:12px')}>
              {FRIENDS.map((fr, i) => (
                <div key={fr.name} style={css('text-align:center;cursor:pointer')}>
                  <div style={{ ...css('position:relative;width:100%;aspect-ratio:1/1;background:#ded4c2'), border: '2px solid ' + FRIEND_BORDERS[i % 4] }}>
                    <Photo slot={fr.slot} alt={fr.name} />
                  </div>
                  <div style={css('font-size:10px;color:#0a44b5;text-decoration:underline;margin-top:4px')}>{fr.name}</div>
                  <div style={css('font-size:9px;color:#777')}>{fr.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={css('display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start')}>

          <div style={css('display:flex;flex-direction:column;gap:16px')}>
            <div>
              <div style={css('background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;color:#6a2c00;font-weight:bold;font-size:11px;padding:4px 7px')}>Currently Reading</div>
              <div style={css('border:1px solid #d8a94a;border-top:none;background:#fffdf2;padding:10px;display:grid;grid-template-columns:62px minmax(0,1fr);gap:10px;align-items:start')}>
                <div style={css('position:relative;height:94px;background:#ded4c2')}><img src="/assets/tree-grows-brooklyn.png" alt="A Tree Grows in Brooklyn cover" className="fill-img" /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={css('font-size:12px;font-weight:bold;line-height:1.3;overflow-wrap:break-word')}>A Tree Grows in Brooklyn</div>
                  <div style={css('font-size:10px;color:#666;margin-top:2px')}>Betty Smith</div>
                  <div style={css('margin-top:8px;height:12px;background:#eee;border:1px solid #b37800')}><div style={css('width:48%;height:12px;background:repeating-linear-gradient(45deg,#2ecc40 0 5px,#1fa32f 5px 10px)')}></div></div>
                  <div style={css('font-size:9px;margin-top:3px')}>about halfway</div>
                  <a href={GOODREADS_URL} target="_blank" rel="noopener" style={css('font-size:10px;display:inline-block;margin-top:7px')}>my goodreads »</a>
                </div>
              </div>
            </div>

            <div>
              <div style={css(blueHead)}>{FIRST_NAME}'s Details</div>
              <div style={css('border:1px solid #7fa8e0;border-top:none;background:#eaf2ff;padding:8px;line-height:1.9;font-size:10px')}>
                <div><b>Status:</b> Working</div>
                <div><b>Here for:</b> community, attention</div>
                <div><b>Sign:</b> Leo ♌</div>
                <div><b>Books read this yr:</b> not enough</div>
              </div>
              <div style={{ marginTop: 16 }}>
                <pixel-cat></pixel-cat>
              </div>
            </div>
          </div>

          <Comments comments={comments} />

        </div>
      </div>
    </div>
  );
}

function Comments({ comments }) {
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');
  const [busy, setBusy] = useState(false);

  const post = async () => {
    const n = name.trim(), body = draft.trim();
    if (!n || !body || busy) return;
    setBusy(true);
    const ok = await submitPost('comments', { name: n, body });
    setBusy(false);
    setName(''); setDraft(''); setSent(postResultMessage(ok));
  };

  const input = 'border:2px inset #ccc;padding:6px;font-family:Verdana,sans-serif;font-size:11px';

  return (
    <div data-cat-hide="1" style={css('position:relative;z-index:3')}>
      <div style={css('background:linear-gradient(#ff7ae0,#e0169b);border:1px solid #9c0e6b;color:#fff;font-weight:bold;font-size:11px;padding:4px 7px')}>{FIRST_NAME}'s Friends Comments</div>
      <div style={css('border:1px solid #f0a5dc;border-top:none;background:#fff;padding:10px')}>
        <input value={name} onChange={(e) => { setName(e.target.value); setSent(''); }} placeholder="your name" maxLength={40} aria-label="your name" style={css('display:block;box-sizing:border-box;width:100%;margin-bottom:6px;' + input)} />
        <div style={css('display:flex;gap:7px;margin-bottom:10px')}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') post(); }} placeholder="leave a comment..." maxLength={600} aria-label="comment" style={css('flex:1;min-width:0;' + input)} />
          <div className="h-c" onClick={post} role="button" style={css('flex:0 0 auto;white-space:nowrap;background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;padding:6px 12px;font-size:11px;font-weight:bold;color:#6a2c00;cursor:pointer')}>Post</div>
        </div>
        {sent && <div style={css('margin-bottom:8px;font-size:10px;color:#a3127a')}>{sent}</div>}
        <div style={css('display:flex;flex-direction:column;gap:10px')}>
          {comments.map((c, i) => (
            <div key={c.slot + i} style={css('display:grid;grid-template-columns:66px minmax(0,1fr);gap:10px;border-bottom:1px dashed #f0a5dc;padding-bottom:10px')}>
              <div style={css('position:relative;width:66px;height:66px;border:1px solid #ccc;background:#ded4c2')}><Photo slot={c.slot} alt={c.name} /></div>
              <div style={{ minWidth: 0 }}>
                <div style={css('display:flex;justify-content:space-between;align-items:flex-start;gap:10px')}>
                  <span style={css('min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#0a44b5;text-decoration:underline;font-weight:bold;font-size:11px')}>{c.name}</span>
                  <span style={css('flex:0 0 auto;white-space:nowrap;font-size:9px;color:#888')}>{c.date}</span>
                </div>
                <div style={css('font-size:11px;line-height:1.7;margin-top:4px;overflow-wrap:break-word')}>{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
