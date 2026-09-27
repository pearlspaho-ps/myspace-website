import { useEffect, useRef, useState } from 'react';
import { css } from '../lib/css.js';
import { SITE_URL } from '../data.js';

export default function Invite() {
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(SITE_URL).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      <div style={css('background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;color:#6a2c00;font-weight:bold;font-size:11px;padding:6px 9px')}>✉ invite ur friends</div>
      <div style={css('border:1px solid #d8a94a;border-top:none;background:#fffdf2;padding:24px;text-align:center')}>
        <div style={css('font-family:Bungee,cursive;font-size:22px;color:#e0169b')}>tell everyone about my space</div>
        <div style={css('font-size:11px;line-height:1.9;margin-top:8px;color:#6a2c00')}>copy the link, send it to whoever. my enemies, my muses, your rich dad.</div>
        <div style={css('max-width:440px;margin:18px auto 0;display:flex;gap:8px')}>
          <input value={SITE_URL} readOnly aria-label="link" onFocus={(e) => e.target.select()} style={css('flex:1;min-width:0;border:2px inset #b37800;padding:9px 10px;font-family:Verdana,sans-serif;font-size:13px;background:#fff;text-align:center')} />
          <div className="h-cd" onClick={copy} role="button" style={css('flex:0 0 auto;white-space:nowrap;background:linear-gradient(#ff7ae0,#e0169b);border:2px solid #9c0e6b;color:#fff;font-weight:bold;font-size:12px;padding:9px 14px;cursor:pointer')}>{copied ? 'copied! ♡' : 'copy link'}</div>
        </div>
        <div style={css('margin-top:22px;font-family:Silkscreen,monospace;font-size:10px;color:#a3127a;animation:blink 1.4s steps(1) infinite')}>☆ {SITE_URL} ☆</div>
      </div>
    </div>
  );
}
