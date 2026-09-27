import { useState } from 'react';
import { css } from '../lib/css.js';
import { submitPost, postResultMessage } from '../lib/posts.js';
import { MOOD_OPTIONS } from '../data.js';

export default function Guestbook({ guests }) {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('happy');
  const [sent, setSent] = useState('');
  const [busy, setBusy] = useState(false);

  const sign = async () => {
    const n = name.trim(), b = body.trim();
    if (!n || !b || busy) return;
    setBusy(true);
    const ok = await submitPost('guestbook', { name: n, body: b, mood });
    setBusy(false);
    setName(''); setBody(''); setMood('happy'); setSent(postResultMessage(ok));
  };

  const note = sent || (name.trim() && body.trim() ? 'ready to post' : 'name + a message, then hit sign it');
  const field = 'border:2px inset #ccc;padding:6px;font-family:Verdana,sans-serif;font-size:11px';

  return (
    <div>
      <div style={css('background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;color:#6a2c00;font-weight:bold;font-size:11px;padding:5px 8px;display:flex;justify-content:space-between;gap:12px;white-space:nowrap')}>
        <span>✍ pearl's guestbook, sign it!!</span><span style={{ fontWeight: 'normal' }}>{guests.length} signatures</span>
      </div>
      <div style={css('border:1px solid #d8a94a;border-top:none;background:#fffdf2;padding:14px')}>

        <div style={css('background:#fff;border:2px dashed #e0169b;padding:12px')}>
          <div style={css('font-family:Silkscreen,monospace;font-size:10px;color:#a3127a;margin-bottom:9px')}>leave ur mark ↓</div>
          <div style={css('display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:8px')}>
            <input value={name} onChange={(e) => { setName(e.target.value); setSent(''); }} placeholder="ur name / handle" maxLength={40} aria-label="your name" style={css(field + ';min-width:0')} />
            <select value={mood} onChange={(e) => setMood(e.target.value)} aria-label="mood" style={css(field)}>
              {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <textarea value={body} onChange={(e) => { setBody(e.target.value); setSent(''); }} placeholder="say hi, tell me a story, be normal" rows={3} maxLength={600} aria-label="message" style={css('margin-top:8px;width:100%;box-sizing:border-box;border:2px inset #ccc;padding:7px;font-family:Verdana,sans-serif;font-size:11px;line-height:1.6;resize:vertical')}></textarea>
          <div style={css('display:flex;align-items:center;gap:10px;margin-top:8px')}>
            <div className="h-c" onClick={sign} role="button" style={css('flex:0 0 auto;white-space:nowrap;cursor:pointer;background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;padding:7px 18px;font-size:11px;font-weight:bold;color:#6a2c00')}>sign it »</div>
            <span style={css('flex:1;min-width:0;font-size:10px;line-height:1.5;color:#888')}>{note}</span>
          </div>
        </div>

        <div style={css('display:flex;flex-direction:column;gap:12px;margin-top:14px')}>
          {guests.map((g, i) => (
            <div key={i} style={{ ...css('background:#fff;border:1px solid #e6d9b8;padding:11px 13px'), borderLeft: '6px solid ' + g.accent }}>
              <div style={css('display:flex;justify-content:space-between;align-items:flex-start;gap:10px')}>
                <span style={css('min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:bold;font-size:12px;color:#0a44b5')}>{g.name}</span>
                <span style={css('flex:0 0 auto;white-space:nowrap;font-size:9px;color:#999')}>{g.date}</span>
              </div>
              <div style={css('font-size:11px;line-height:1.75;margin-top:5px;overflow-wrap:break-word')}>{g.body}</div>
              <div style={css('font-family:Silkscreen,monospace;font-size:9px;color:#a3127a;margin-top:7px')}>mood: {g.mood}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
