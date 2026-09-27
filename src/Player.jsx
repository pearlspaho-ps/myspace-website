import { useEffect, useState, useSyncExternalStore } from 'react';
import { css } from './lib/css.js';
import * as song from './lib/audio.js';
import Photo from './Photo.jsx';
import { FIRST_NAME, TRACK } from './data.js';

const BAR_COLS = ['#2ecc40', '#6ef7ff', '#ffe14d', '#ff4fd8'];
const fmtTime = (sec) => { sec = Math.floor(sec || 0); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };

let snapshot = song.getState();
const subscribe = (fn) => song.subscribe(() => {
  const s = song.getState();
  if (s.playing !== snapshot.playing || s.cur !== snapshot.cur || s.dur !== snapshot.dur || s.rate !== snapshot.rate) snapshot = s;
  fn();
});
const getSnapshot = () => snapshot;

let discAngle = 0; // survives page switches

export default function Player() {
  const { playing, cur, dur, rate } = useSyncExternalStore(subscribe, getSnapshot);
  const [levels, setLevels] = useState([]);
  const [angle, setAngle] = useState(discAngle);

  useEffect(() => {
    if (!playing) return;
    let raf, lastT = 0;
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (t - lastT < 15) return;
      lastT = t;
      setLevels(song.readLevels());
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const onDiscDown = (e) => song.startScratch(e, (d) => { discAngle += d; setAngle(discAngle); });
  const prog = dur ? (cur / dur) * 100 : 0;
  const btn = 'height:20px;padding:0 7px;display:flex;align-items:center;background:linear-gradient(#eee,#aaa);border:1px solid #666;cursor:pointer;font-size:10px;white-space:nowrap';

  return (
    <div>
      <div style={css('background:linear-gradient(#2b2b2b,#000);border:1px solid #000;color:#6ef7ff;font-family:Silkscreen,monospace;font-size:11px;padding:5px 8px;display:flex;justify-content:space-between;gap:12px;white-space:nowrap')}>
        <span>♫ {FIRST_NAME}'s profile song</span>
        <span style={{ color: '#ff4fd8' }}>{playing ? 'NOW PLAYING' : 'PRESS PLAY ♥'}</span>
      </div>
      <div style={css('border:1px solid #000;border-top:none;background:linear-gradient(#3a3a3a,#1a1a1a);padding:10px;display:grid;grid-template-columns:78px 1fr;gap:12px;align-items:center')}>
        <div onPointerDown={onDiscDown} title="drag to scratch" style={{ ...css('position:relative;width:78px;height:78px;cursor:grab;touch-action:none'), transform: 'rotate(' + angle + 'deg)' }}>
          <div style={{ ...css('position:absolute;inset:0;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px #555,0 3px 8px rgba(0,0,0,0.5)'), animation: playing ? 'spin 4s linear infinite' : 'none' }}>
            <Photo slot="ms-albumart" alt="album art" />
            <div style={css('position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#111;box-shadow:0 0 0 1px #555')}></div>
          </div>
        </div>
        <div>
          <div style={css('color:#fff;font-size:13px;font-weight:bold')}>{TRACK.title}</div>
          <div style={css('color:#9aa;font-size:10px;margin-top:2px')}>{TRACK.artist}</div>
          <div style={css('display:flex;align-items:center;gap:8px;margin-top:9px')}>
            <div className="h-y" onClick={song.togglePlay} title={playing ? 'pause' : 'play'} style={css('width:28px;height:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(#6ef7ff,#12a6bb);border:1px solid #06616f;color:#032;cursor:pointer;font-size:11px')}>{playing ? '❚❚' : '▶'}</div>
            <div className="h-y" onClick={song.restart} title="start over" style={css('width:28px;height:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(#eee,#aaa);border:1px solid #666;cursor:pointer;font-size:11px')}>▸▸</div>
            <div
              onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); song.seekFraction((e.clientX - r.left) / r.width); }}
              title="click to skip to a part"
              style={css('flex:1;height:13px;background:#0d0d0d;border:1px solid #555;position:relative;overflow:hidden;cursor:pointer')}
            >
              <div style={{ ...css('height:13px;background:linear-gradient(#ff7ae0,#e0169b);pointer-events:none'), width: prog.toFixed(1) + '%' }}></div>
            </div>
            <span style={css('flex:0 0 auto;white-space:nowrap;color:#6ef7ff;font-family:Silkscreen,monospace;font-size:10px')}>{fmtTime(cur) + ' / ' + (dur ? fmtTime(dur) : TRACK.len)}</span>
          </div>
          <div style={css('display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:8px 10px;margin-top:8px')}>
            <div style={css('display:flex;gap:5px;height:22px;align-items:flex-end')}>
              {BAR_COLS.concat(BAR_COLS, BAR_COLS, BAR_COLS).slice(0, 14).map((c, i) => (
                <span key={i} style={{ width: 5, height: (playing ? 3 + (levels[i] || 0) * 19 : 3).toFixed(1) + 'px', background: c }}></span>
              ))}
            </div>
            <div style={css('display:flex;align-items:center;gap:6px')}>
              <div className="h-y" onClick={() => song.jumpBy(-10)} style={css(btn)}>« 10s</div>
              <div className="h-y" onClick={() => song.jumpBy(10)} style={css(btn)}>10s »</div>
              <div className="h-c" onClick={song.cycleSpeed} title="change speed" style={css('height:20px;padding:0 8px;display:flex;align-items:center;background:linear-gradient(#ffe14d,#ffb400);border:1px solid #b37800;color:#6a2c00;font-weight:bold;cursor:pointer;font-size:10px;white-space:nowrap')}>{rate + 'x'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
