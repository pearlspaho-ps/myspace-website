import { css } from '../lib/css.js';
import { LINKS } from '../data.js';

const ICONS = {
  goodreads: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 6.2C10.4 4.9 8.3 4.4 5.2 4.6v13c3.1-.2 5.2.3 6.8 1.6 1.6-1.3 3.7-1.8 6.8-1.6v-13c-3.1-.2-5.2.3-6.8 1.6Z" /><path d="M12 6.2v13" /></svg>,
  spotify: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="8.6" /><path d="M7.6 9.6c2.9-.8 6-.5 8.6.9" /><path d="M8.2 12.6c2.3-.6 4.8-.3 6.9.8" /><path d="M8.9 15.4c1.8-.5 3.7-.3 5.3.6" /></svg>,
  instagram: <svg width="24" height="20" viewBox="0 0 30 22" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="5" r="2.6" /><circle cx="23" cy="5" r="2.6" /><path d="M7 8.1v4.4l-2.4 2.2v4.6" /><path d="M7 12.5l2.5 2.3v4.5" /><path d="M23 8.1v4.4l2.4 2.2v4.6" /><path d="M23 12.5l-2.5 2.3v4.5" /><path d="M9.5 13.4h11" /></svg>,
  letterboxd: <svg width="22" height="20" viewBox="0 0 26 22" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"><path d="M3 7.5h13.5v10H3z" /><path d="M16.5 11l6-3v7l-6-3z" /><circle cx="9.7" cy="12.5" r="2.6" /><path d="M6.5 7.5l1.6-3h4l1.6 3" /></svg>,
  youtube: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="3" /><path d="M11 9.7l4 2.3-4 2.3z" /></svg>,
  linkedin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"><path d="M6 10v8" /><path d="M6 6.4v.2" /><path d="M11 18v-8" /><path d="M11 13c0-1.7 1.3-3 3-3s3 1.3 3 3v5" /></svg>,
  beli: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v7a2.5 2.5 0 0 0 5 0V4" /><path d="M9.5 11v9" /><path d="M17 4c1.6 1.4 2.2 3.4 1.9 5.4-.2 1.3-1 2.1-1.9 2.1V20" /></svg>,
  email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M3 6.5l9 6.5 9-6.5" /></svg>
};

export default function Links() {
  return (
    <div>
      <div style={css('background:linear-gradient(#ff7ae0,#e0169b);border:1px solid #9c0e6b;color:#fff;font-weight:bold;font-size:11px;padding:5px 8px')}>everywhere else u can find me</div>
      <div style={css('border:1px solid #f0a5dc;border-top:none;background:#fff;padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
        {LINKS.map(l => {
          const inner = (
            <>
              <span style={{ ...css('width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:17px;color:#fff'), background: l.color }}>{ICONS[l.label]}</span>
              <span style={{ minWidth: 0 }}>
                <span style={css('display:block;font-weight:bold;font-size:12px')}>{l.label}</span>
                <span style={css('display:block;font-size:10px;color:#666;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{l.handle}</span>
              </span>
            </>
          );
          const box = { ...css('display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:center;text-decoration:none;color:#1a1a1a;background:#fffdf7;padding:9px'), border: '2px solid ' + l.color };
          // beli has no public profile link, just the handle
          return l.href
            ? <a key={l.label} className="h-y" href={l.href} target="_blank" rel="noopener" style={box}>{inner}</a>
            : <div key={l.label} style={box}>{inner}</div>;
        })}
      </div>
      <div style={css("border:1px solid #f0a5dc;border-top:none;background:#fdeaf7;padding:10px;font-family:'Comic Sans MS',cursive;font-size:12px;color:#a3127a;text-align:center")}>explore me</div>
    </div>
  );
}
