// Archived pages: not in the nav, kept for later (reachable at #letters and #bag).
import { useState } from 'react';
import { css } from '../lib/css.js';
import { LETTERS, LETTERS_PASSWORD, BAG_ITEMS } from '../data.js';

export function Letters() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const tryUnlock = () => {
    if (code.trim().toLowerCase() === LETTERS_PASSWORD) { setOpen(true); setCode(''); setMsg(''); }
    else setMsg('wrong password. are u even my friend');
  };

  if (!open) {
    return (
      <div>
        <div style={css('background:linear-gradient(#2b2b2b,#000);border:1px solid #000;color:#6ef7ff;font-family:Silkscreen,monospace;font-size:11px;padding:6px 9px')}>🔒 private, friends only</div>
        <div style={css('border:1px solid #000;border-top:none;background:#fff;padding:32px 20px;text-align:center')}>
          <div style={css('font-family:Bungee,cursive;font-size:20px;color:#e0169b')}>these letters are private</div>
          <div style={css('font-size:11px;line-height:1.9;margin-top:6px;color:#555')}>you need the password. if you don't have it, ask me nicely.</div>
          <div style={css('max-width:360px;margin:18px auto 0;display:flex;gap:8px')}>
            <input type="password" value={code} onChange={(e) => { setCode(e.target.value); setMsg(''); }} onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock(); }} placeholder="password" style={css('flex:1;min-width:0;border:2px inset #ccc;padding:9px 10px;font-family:Verdana,sans-serif;font-size:12px;background:#fff')} />
            <div className="h-cd" onClick={tryUnlock} role="button" style={css('flex:0 0 auto;white-space:nowrap;background:linear-gradient(#ff7ae0,#e0169b);border:2px solid #9c0e6b;color:#fff;font-weight:bold;font-size:12px;padding:9px 14px;cursor:pointer')}>enter</div>
          </div>
          <div style={css("margin-top:10px;min-height:16px;font-family:'Comic Sans MS',cursive;font-size:11px;color:#c0392b")}>{msg}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={css('background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;color:#6a2c00;font-weight:bold;font-size:11px;padding:5px 8px')}>✉ letters: writing i keep coming back to</div>
      <div style={css('border:1px solid #d8a94a;border-top:none;background:#fffdf2;padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
        {LETTERS.map(lt => (
          <div key={lt.from} style={css('background:#fff;border:1px solid #e0d3a8;box-shadow:2px 2px 0 #e8dcb5;padding:14px 16px 12px;background-image:repeating-linear-gradient(#fff 0 25px,#eef2f7 25px 26px)')}>
            <div style={css('display:flex;justify-content:space-between;gap:10px;align-items:baseline;border-bottom:1px dashed #d8c99a;padding-bottom:6px')}>
              <span style={css('font-family:Silkscreen,monospace;font-size:10px;line-height:1.5;color:#a3127a;overflow-wrap:break-word')}>{lt.from}</span>
              <span style={css('font-size:9px;color:#999;white-space:nowrap')}>{lt.date}</span>
            </div>
            <div style={css("font-family:'Comic Sans MS',cursive;font-size:13px;line-height:26px;color:#2b2b4a;margin-top:8px;min-height:104px")}>{lt.body}</div>
            <div style={css('position:relative;height:74px;margin-top:8px;background:#f4efe0')}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Bag() {
  const img = (src, alt, style) => <img src={'/assets/' + src} alt={alt} style={css('position:absolute;' + style)} />;
  return (
    <div>
      <div style={css('background:linear-gradient(#ff7ae0,#e0169b);border:1px solid #9c0e6b;color:#fff;font-weight:bold;font-size:11px;padding:5px 8px')}>👛 what's in my bag</div>
      <div style={css('border:1px solid #f0a5dc;border-top:none;background:#fdeaf7;padding:18px;display:grid;grid-template-columns:360px minmax(0,1fr);gap:20px;align-items:start')}>
        <div style={css('position:relative;padding-top:40px')}>
          <div style={css('position:absolute;left:50%;top:0;margin-left:-74px;width:148px;height:80px;border:10px solid #8a5230;border-bottom:none;border-radius:74px 74px 0 0;box-sizing:border-box')}></div>
          <div style={css('position:relative;background:linear-gradient(#cf94bf,#a8639a);border:3px solid #7a3f68;border-radius:16px 16px 30px 30px;padding:14px;box-shadow:inset 0 4px 0 rgba(255,255,255,0.45),5px 5px 0 #7a3f68')}>
            <div style={css('position:relative;height:340px;background:linear-gradient(#f6e4f1,#e6cbe0);border:2px solid #7a3f68;border-radius:10px;overflow:hidden')}>
              {img('wallet.png', 'kate spade card wallet', 'z-index:3;left:10px;bottom:12px;width:150px;transform:rotate(-7deg);border-radius:5px;box-shadow:4px 5px 0 rgba(122,63,104,0.32)')}
              {img('iphone-cut.png', 'iphone 17 pro', 'z-index:4;left:217px;top:146px;width:106px;transform:rotate(9deg);filter:drop-shadow(-4px 5px 0 rgba(122,63,104,0.3))')}
              {img('tower28.png', 'tower 28 lip gloss', 'z-index:3;left:26px;top:8px;width:34px;transform:rotate(-13deg)')}
              {img('aquaphor.png', 'aquaphor', 'z-index:3;left:96px;top:26px;width:52px;transform:rotate(6deg)')}
              {img('cloudpaint.png', 'glossier cloud paint in storm', 'z-index:3;left:245px;top:5px;width:70px;transform:rotate(-8deg)')}
            </div>
            <div style={css('margin-top:12px;text-align:center;font-family:Silkscreen,monospace;font-size:9px;color:#3d1a33')}>everything lives in here</div>
          </div>
        </div>
        <div style={css('display:flex;flex-direction:column;gap:12px')}>
          <div>
            <div style={css('background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;color:#6a2c00;font-weight:bold;font-size:11px;padding:4px 7px')}>the inventory</div>
            <div style={css('border:1px solid #d8a94a;border-top:none;background:#fffdf2;padding:12px;font-size:11px;line-height:1.95')}>
              {BAG_ITEMS.map(t => <div key={t}>· {t}</div>)}
            </div>
          </div>
          <div style={css("background:#fff;border:1px dashed #e0169b;padding:10px;font-family:'Comic Sans MS',cursive;font-size:12px;color:#a3127a")}>more to add later ♡</div>
        </div>
      </div>
    </div>
  );
}
