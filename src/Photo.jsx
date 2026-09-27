import { PHOTOS } from './data.js';

// Renders one of Pearl's photos filling its (position:relative) frame, keeping
// the crop she set in the design tool. `aspect` is the frame's width / height.
export default function Photo({ slot, alt = '', aspect = 1 }) {
  const p = PHOTOS[slot];
  if (!p) return null;
  if (p.s === 1 && Math.abs(p.x) < 0.5 && Math.abs(p.y) < 0.5) {
    return <img className="fill-img" src={p.src} alt={alt} loading="lazy" />;
  }
  // same math as the design tool: cover-fit, scaled by s, centre offset by x/y %
  const imgAspect = p.w / p.h;
  const w = (imgAspect > aspect ? imgAspect / aspect : 1) * p.s * 100;
  const h = (imgAspect > aspect ? 1 : aspect / imgAspect) * p.s * 100;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <img
        src={p.src}
        alt={alt}
        loading="lazy"
        style={{ position: 'absolute', left: 50 + p.x + '%', top: 50 + p.y + '%', width: w + '%', height: h + '%', maxWidth: 'none', transform: 'translate(-50%,-50%)', display: 'block' }}
      />
    </div>
  );
}
