import { useState } from 'react';
import { css } from '../lib/css.js';
import { EMAIL, EMAIL_IDEAS, ADDRESS_REQUEST_URL } from '../data.js';

// With VITE_FORMSPREE_ID set, messages are sent straight from the site.
// Without it, "Send it" falls back to opening a pre-filled Gmail compose window.
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

export default function Mail() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const composeHref = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + EMAIL + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

  const send = async (e) => {
    if (!FORMSPREE_ID) return; // let the link open Gmail
    e.preventDefault();
    if (status === 'sending...') return;
    if (!body.trim()) { setStatus('write something first'); return; }
    setStatus('sending...');
    try {
      const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject.trim() || 'a message from ur myspace', subject, message: body })
      });
      if (!res.ok) throw new Error('send failed');
      setSubject(''); setBody(''); setStatus('sent! ♡ thank u');
    } catch (err) {
      setStatus('couldn’t send, try again later');
    }
  };

  const input = 'box-sizing:border-box;width:100%;border:2px inset #ccc;font-family:Verdana,sans-serif;font-size:11px';

  return (
    <div style={css('display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:16px;align-items:center')}>
      <div>
        <div style={css('background:linear-gradient(#4f8ce8,#1b5bbd);border:1px solid #0b3474;color:#fff;font-weight:bold;font-size:11px;padding:5px 8px')}>✉ send pearl a message</div>
        <div style={css('border:1px solid #7fa8e0;border-top:none;background:#eaf2ff;padding:14px')}>
          <div style={css('display:grid;grid-template-columns:66px minmax(0,1fr);gap:8px 10px;align-items:center;font-size:11px')}>
            <span style={{ fontWeight: 'bold' }}>To:</span>
            <span style={css('background:#fff;border:2px inset #ccc;padding:7px 8px;line-height:1.3')}>{EMAIL}</span>
            <span style={{ fontWeight: 'bold' }}>Subject:</span>
            <input value={subject} onChange={(e) => { setSubject(e.target.value); setStatus(''); }} placeholder="hi pearl!! you're the best" aria-label="subject" style={css(input + ';padding:7px 8px;line-height:1.3;min-width:0')} />
          </div>
          <textarea value={body} onChange={(e) => { setBody(e.target.value); setStatus(''); }} placeholder="write something nice, dont be mean" rows={9} aria-label="message" style={css(input + ';display:block;margin-top:8px;padding:8px;line-height:1.6;resize:vertical')}></textarea>
          <div style={css('display:flex;align-items:center;gap:10px;margin-top:8px')}>
            <a className="h-c" href={composeHref} target="_blank" rel="noopener" onClick={send} style={css('flex:0 0 auto;white-space:nowrap;text-decoration:none;background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;padding:8px 16px;font-size:11px;font-weight:bold;color:#6a2c00')}>Send it »</a>
            <span style={{ ...css('flex:1;min-width:0;font-size:10px;line-height:1.5'), color: status ? '#a3127a' : '#666' }}>
              {status || (FORMSPREE_ID ? 'goes straight to my inbox' : 'opens a pre-filled compose window : hit send there')}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div style={css('background:linear-gradient(#ff7ae0,#e0169b);border:1px solid #9c0e6b;color:#fff;font-weight:bold;font-size:11px;padding:5px 8px')}>good things to email me</div>
        <div style={css('border:1px solid #f0a5dc;border-top:none;background:#fff;padding:10px;font-size:11px;line-height:1.9')}>
          {EMAIL_IDEAS.map(t => <div key={t}>· {t}</div>)}
        </div>
        <div style={css('margin-top:12px;background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;color:#6a2c00;font-weight:bold;font-size:11px;padding:5px 8px')}>or you can send me real mail:</div>
        <div style={css('border:1px solid #d8a94a;border-top:none;background:#fffdf2;padding:12px;text-align:center')}>
          <a className="h-cd" href={ADDRESS_REQUEST_URL} target="_blank" rel="noopener" style={css('display:block;text-decoration:none;background:linear-gradient(#ff7ae0,#e0169b);border:2px solid #9c0e6b;color:#fff;font-weight:bold;font-size:11px;padding:9px 12px;cursor:pointer')}>press to request my adress</a>
        </div>
      </div>
    </div>
  );
}
