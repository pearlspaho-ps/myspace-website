import { useState } from 'react';
import { css } from '../lib/css.js';
import Photo from '../Photo.jsx';
import { GALLERY, ALBUMS } from '../data.js';

export default function Film() {
  const [album, setAlbum] = useState('all');
  const shown = album === 'all' ? GALLERY : GALLERY.filter(g => g.album === album);

  return (
    <div>
      <div style={css('background:linear-gradient(#4f8ce8,#1b5bbd);border:1px solid #0b3474;color:#fff;font-weight:bold;font-size:11px;padding:5px 8px;display:flex;justify-content:space-between;gap:12px;white-space:nowrap')}>
        <span>📷 photo gallery - still adding more...</span><span style={{ fontWeight: 'normal' }}>{shown.length} pics</span>
      </div>
      <div style={css('border:1px solid #7fa8e0;border-top:none;background:#eaf2ff;padding:12px')}>
        <div style={css('display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap')}>
          {ALBUMS.map(a => (
            <span
              key={a}
              className="h-yt"
              onClick={() => setAlbum(a)}
              role="button"
              style={{ ...css('display:inline-block;white-space:nowrap;line-height:1.4;cursor:pointer;font-size:10px;padding:4px 9px;border:1px solid #0b3474'), background: album === a ? '#1b5bbd' : '#fff', color: album === a ? '#fff' : '#0b3474' }}
            >{a + ' (' + (a === 'all' ? GALLERY.length : GALLERY.filter(g => g.album === a).length) + ')'}</span>
          ))}
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px')}>
          {shown.map(g => (
            <div key={g.slot} style={css('background:#fff;border:1px solid #7fa8e0;padding:5px')}>
              <div style={css('position:relative;aspect-ratio:1/1;background:#ded4c2')}><Photo slot={g.slot} alt={g.cap} /></div>
              <div style={css('font-size:9px;color:#555;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{g.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
