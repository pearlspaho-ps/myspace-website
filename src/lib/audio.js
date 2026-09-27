// The profile song. One audio element for the whole app, created outside React
// so it keeps playing while visitors switch pages.
import { SONG_URL } from '../data.js';

const audio = new Audio();
audio.loop = true;
audio.preload = 'auto';
audio.src = SONG_URL;

let rate = 1;
let actx = null, analyser = null, freq = null;
let rawSong = null, beats = null;
let scratchBuf = null, scratchRev = null, scratchOut = null, decoding = false;
let lv = null;
const listeners = new Set();

const notify = () => listeners.forEach(fn => fn());
['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange', 'seeked'].forEach(ev => audio.addEventListener(ev, notify));

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function getState() {
  return { playing: !audio.paused, cur: audio.currentTime || 0, dur: audio.duration || 0, rate };
}

// Download the song once, then play it from memory. The raw bytes also feed the
// beat finder (EQ bars) and the record-scratch sound.
fetch(SONG_URL).then(r => r.blob()).then(b => {
  b.arrayBuffer().then(ab => { rawSong = ab; findBeats(ab.slice(0)); }).catch(() => {});
  const resume = { t: audio.currentTime, play: !audio.paused };
  audio.addEventListener('loadedmetadata', function once() {
    audio.removeEventListener('loadedmetadata', once);
    audio.playbackRate = rate;
    try { audio.currentTime = resume.t; } catch (e) {}
    if (resume.play) audio.play().catch(() => {});
  });
  audio.src = URL.createObjectURL(b);
}).catch(() => {});

async function findBeats(ab) {
  try {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!OAC) return;
    const buf = await new OAC(1, 44100, 44100).decodeAudioData(ab);
    const x = buf.getChannelData(0), sr = buf.sampleRate, hop = 512;
    const a = 1 - Math.exp(-2 * Math.PI * 160 / sr);
    const nF = Math.floor(x.length / hop), en = new Float32Array(nF);
    let y = 0;
    for (let fi = 0; fi < nF; fi++) {
      let sum = 0;
      for (let j = fi * hop, J = j + hop; j < J; j++) { y += a * (x[j] - y); sum += y * y; }
      en[fi] = Math.log(1e-6 + sum);
    }
    const o = new Float32Array(nF);
    for (let i = 1; i < nF; i++) o[i] = Math.max(0, en[i] - en[i - 1]);
    const fps = sr / hop;
    const at = (p) => { const i = Math.floor(p), fr = p - i; return i + 1 < nF ? o[i] * (1 - fr) + o[i + 1] * fr : 0; };
    let best = 0, bestL = fps * 0.5;
    for (let bpm = 70; bpm <= 170; bpm += 0.1) {
      const L = fps * 60 / bpm; let sc = 0;
      for (let p = 0; p + L < nF; p += 1) sc += o[p] * at(p + L);
      if (sc > best) { best = sc; bestL = L; }
    }
    let bp = 0, bs = -1;
    for (let ph = 0; ph < bestL; ph += 0.5) { let sc = 0; for (let p = ph; p < nF; p += bestL) sc += at(p); if (sc > bs) { bs = sc; bp = ph; } }
    const out = [];
    for (let p = bp; p < nF; p += bestL) {
      let m = Math.round(p), mv = -1;
      for (let q = Math.max(0, Math.round(p) - 3); q <= Math.min(nF - 1, Math.round(p) + 3); q++) if (o[q] > mv) { mv = o[q]; m = q; }
      out.push(m * hop / sr);
    }
    beats = out;
  } catch (e) {}
}

function startViz() {
  try {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      actx = new AC();
      const src = actx.createMediaElementSource(audio);
      analyser = actx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.6;
      src.connect(analyser); analyser.connect(actx.destination);
      freq = new Uint8Array(analyser.frequencyBinCount);
    }
    if (actx.state === 'suspended') actx.resume();
  } catch (e) {}
}

// 14 EQ bar levels (0..1), driven by the live spectrum and the detected beat.
export function readLevels() {
  const cur = audio.currentTime, B = beats;
  let env = 0;
  if (B && B.length) {
    let lo = 0, hi = B.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (B[m] <= cur) lo = m; else hi = m - 1; }
    const since = cur - B[lo];
    // quick eased attack, long smooth decay
    env = since < 0 ? 0 : since < 0.035 ? Math.sin((since / 0.035) * Math.PI / 2) : Math.exp(-(since - 0.035) / 0.2);
    if (lo % 4 === 0) env = Math.min(1, env * 1.15);
  }
  let spec = null;
  if (analyser) { analyser.getByteFrequencyData(freq); spec = freq; }
  const n = 14, levels = [];
  for (let i = 0; i < n; i++) {
    let sp;
    if (spec) {
      const lo = Math.floor(Math.pow(i / n, 1.5) * spec.length * 0.75), hi = Math.max(lo + 1, Math.floor(Math.pow((i + 1) / n, 1.5) * spec.length * 0.75));
      let sum = 0; for (let k = lo; k < hi; k++) sum += spec[k];
      sp = Math.pow(sum / (hi - lo) / 255, 1.25);
    } else sp = 0.45 + 0.35 * Math.abs(Math.sin(i * 1.7));
    const target = Math.min(1, 0.08 + sp * (0.5 + 0.5 * env));
    const prev = (lv && lv[i]) || 0.08;
    levels.push(prev + (target - prev) * 0.5);
  }
  lv = levels;
  return levels;
}

export function togglePlay() {
  if (audio.paused) { startViz(); audio.play().catch(() => notify()); }
  else audio.pause();
}

export function restart() { audio.currentTime = 0; notify(); }

export function jumpBy(d) {
  if (!audio.duration) return;
  audio.currentTime = Math.max(0, Math.min(audio.duration - 0.25, audio.currentTime + d));
  notify();
}

export function seekFraction(f) {
  if (!audio.duration) return;
  audio.currentTime = Math.max(0, Math.min(1, f)) * audio.duration;
  notify();
}

export function cycleSpeed() {
  const opts = [0.5, 1, 1.25, 1.5, 2];
  rate = opts[(opts.indexOf(rate) + 1) % opts.length];
  audio.playbackRate = rate;
  notify();
}

// --- record scratching: dragging the disc plays short grains of the song ---

async function ensureScratch() {
  startViz();
  if (scratchBuf || !actx || !rawSong || decoding) return;
  decoding = true;
  try {
    const buf = await actx.decodeAudioData(rawSong.slice(0));
    const rev = actx.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
    for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c).slice(); d.reverse(); rev.copyToChannel(d, c); }
    scratchBuf = buf; scratchRev = rev;
    scratchOut = actx.createBiquadFilter(); scratchOut.type = 'lowpass'; scratchOut.frequency.value = 2600;
    const g = actx.createGain(); g.gain.value = 1.4; scratchOut.connect(g); g.connect(actx.destination);
  } catch (e) {}
  decoding = false;
}

function grain(pos, speed) {
  if (!scratchBuf || !actx) return;
  const back = speed < 0, sp = Math.min(4, Math.max(0.15, Math.abs(speed)));
  const buf = back ? scratchRev : scratchBuf;
  const dur = scratchBuf.duration;
  const off = back ? Math.max(0, dur - pos) : Math.max(0, pos);
  const src = actx.createBufferSource(); src.buffer = buf; src.playbackRate.value = sp;
  const g = actx.createGain(); const now = actx.currentTime;
  g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(1, now + 0.006); g.gain.linearRampToValueAtTime(0, now + 0.07);
  src.connect(g); g.connect(scratchOut);
  src.start(now, Math.min(off, dur - 0.1), 0.08);
}

// Starts a scratch gesture. `onTurn(deg)` is called as the disc rotates.
export function startScratch(e, onTurn) {
  e.preventDefault();
  ensureScratch();
  const resumeAfter = !audio.paused;
  if (resumeAfter) audio.pause();
  let lastMoveT = performance.now();
  const box = e.currentTarget.getBoundingClientRect();
  const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
  const ang = (ev) => Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI;
  let last = ang(e);
  const move = (ev) => {
    const now = ang(ev);
    let d = now - last; if (d > 180) d -= 360; if (d < -180) d += 360;
    last = now;
    const tNow = performance.now(), dt = Math.max(8, tNow - lastMoveT); lastMoveT = tNow;
    onTurn(d);
    jumpBy(d / 30);
    // degrees per ms -> playback speed (≈ 0.33 turns/sec = normal)
    if (Math.abs(d) > 0.4) grain(audio.currentTime, (d / dt) / 0.12);
  };
  const up = () => {
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
    if (resumeAfter) audio.play().catch(() => {});
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
}
