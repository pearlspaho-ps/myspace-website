import { css } from '../lib/css.js';
import { TOP_SONGS, SPOTIFY_URL } from '../data.js';

const COLORS = ['#ff4fd8', '#6ef7ff', '#ffe14d', '#2ecc40', '#e0169b', '#12a6bb', '#c0392b', '#a3127a'];

export default function Music() {
  return (
    <div>
      <div style={css('background:linear-gradient(#2b2b2b,#000);border:1px solid #000;color:#6ef7ff;font-family:Silkscreen,monospace;font-size:11px;padding:6px 9px;display:flex;justify-content:space-between;gap:12px;white-space:nowrap')}>
        <span>♫ pearl's top songs right now</span><span style={{ color: '#ff4fd8' }}>updated whenever</span>
      </div>
      <div style={css('border:1px solid #000;border-top:none;background:linear-gradient(#f6e4f1,#eadff2);padding:16px')}>
        <div style={css('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px')}>
          {TOP_SONGS.map((t, i) => {
            const color = COLORS[i % 8];
            return (
              <div key={t.title} style={{ ...css('display:grid;grid-template-columns:34px 58px minmax(0,1fr);gap:11px;align-items:center;background:#fff;padding:9px'), border: '2px solid ' + color }}>
                <span style={{ ...css('font-family:Silkscreen,monospace;font-size:16px;text-align:center'), color }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={css('position:relative;width:58px;height:58px;display:block;background:#ded4c2;border:1px solid #bbb')}>
                  <img src={`/assets/song-${t.img}.png`} alt={t.title + ' cover'} loading="lazy" className="fill-img" />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={css('display:block;font-weight:bold;font-size:12px;line-height:1.3;overflow-wrap:break-word')}>{t.title}</span>
                  <span style={css('display:block;font-size:10px;color:#666;margin-top:2px')}>{t.artist}</span>
                  <span style={css('display:block;height:7px;margin-top:6px;background:#eee;border:1px solid #ddd')}><span style={{ display: 'block', height: 5, width: (100 - i * 8) + '%', background: color }}></span></span>
                </span>
              </div>
            );
          })}
        </div>
        <div style={css('margin-top:14px;display:flex;justify-content:center')}>
          <a className="h-yt" href={SPOTIFY_URL} target="_blank" rel="noopener" style={css('display:block;width:260px;text-align:center;text-decoration:none;background:linear-gradient(#7ae08f,#189c3a);border:2px solid #0d6b26;color:#fff;font-weight:bold;font-size:12px;padding:12px')}>the whole library on spotify »</a>
        </div>
      </div>
    </div>
  );
}
