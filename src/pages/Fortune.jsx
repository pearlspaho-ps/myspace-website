import { useEffect, useRef, useState } from 'react';
import { css } from '../lib/css.js';
import { FORTUNES } from '../data.js';

export default function Fortune() {
  const [q, setQ] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState('');
  const [thinking, setThinking] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const ask = () => {
    const question = q.trim();
    if (!question || thinking) return;
    setThinking(true); setAsked(question); setQ('');
    timer.current = setTimeout(() => {
      setAnswer(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
      setThinking(false);
    }, 1600);
  };

  const shown = thinking ? 'the spirits are buffering...' : (answer || 'ask me anything');
  const small = !thinking && answer && answer.length > 60;

  return (
    <div>
      <div style={css('background:linear-gradient(#2b2b2b,#000);border:1px solid #000;color:#6ef7ff;font-family:Silkscreen,monospace;font-size:11px;padding:6px 9px;display:flex;justify-content:space-between;gap:12px;white-space:nowrap')}>
        <span>✧ my third eye ✧</span><span style={{ color: '#ff4fd8' }}>accuracy: 100%</span>
      </div>
      <div style={css('border:1px solid #000;border-top:none;background:radial-gradient(ellipse at 50% 40%,#3b1766 0%,#1b0d2e 70%);padding:30px 20px 34px;display:flex;flex-direction:column;align-items:center;gap:18px')}>

        <div style={css('font-family:Bungee,cursive;font-size:20px;color:#fff;animation:glow 3.5s ease-in-out infinite;text-align:center')}>ask the ball a question</div>

        <div key={thinking ? asked : 'idle'} style={{ ...css('display:flex;flex-direction:column;align-items:center'), animation: thinking ? 'shake 0.5s ease-in-out 3' : 'bob 3s ease-in-out infinite' }}>
          <div style={css('position:relative;width:230px;height:230px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffffff 0%,#e6c9ff 12%,#a86ce0 38%,#5b2a86 70%,#2a0f4a 100%);box-shadow:0 0 40px #ff4fd8,0 0 90px rgba(110,247,255,0.45),inset -18px -22px 40px rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;overflow:hidden')}>
            <img src="/assets/ball-face.png" alt="" style={css('position:absolute;inset:6px;width:218px;height:218px;border-radius:50%;opacity:0.38;mix-blend-mode:screen;filter:blur(0.6px);animation:swirl 5s ease-in-out infinite')} />
            <div style={css('position:absolute;inset:26px;border-radius:50%;background:radial-gradient(circle at 60% 60%,rgba(255,79,216,0.55),rgba(110,247,255,0.25) 45%,transparent 70%);animation:swirl 4s ease-in-out infinite')}></div>
            <div style={css('position:absolute;left:44px;top:34px;width:54px;height:30px;border-radius:50%;background:rgba(255,255,255,0.7);filter:blur(6px);transform:rotate(-25deg)')}></div>
            <div aria-live="polite" style={{ ...css("position:relative;max-width:160px;text-align:center;font-family:'Comic Sans MS',cursive;line-height:1.35;color:#fff;text-shadow:0 0 8px #ff4fd8,0 1px 2px #000;text-wrap:balance"), fontSize: small ? '10px' : '15px' }}>{shown}</div>
          </div>
          <div style={css('width:170px;height:34px;margin-top:-10px;background:linear-gradient(#b8860b,#6b4a06);border:2px solid #3d2a03;border-radius:6px 6px 16px 16px;box-shadow:0 8px 18px rgba(0,0,0,0.5)')}></div>
          <div style={css('width:210px;height:14px;background:linear-gradient(#8a6408,#4a3304);border:2px solid #3d2a03;border-top:none;border-radius:0 0 8px 8px')}></div>
        </div>

        <div style={css('min-height:16px;font-size:11px;color:#e6c9ff;font-style:italic;text-align:center')}>{asked ? 'you asked: “' + asked + '”' : ''}</div>

        <div style={css('width:100%;max-width:440px;display:flex;gap:8px')}>
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(); }} placeholder="question??? question??" aria-label="your question" style={css('flex:1;min-width:0;border:2px inset #a86ce0;padding:9px 10px;font-family:Verdana,sans-serif;font-size:12px;background:#fff')} />
          <div className="h-cd" onClick={ask} role="button" style={css('flex:0 0 auto;white-space:nowrap;background:linear-gradient(#ff7ae0,#e0169b);border:2px solid #9c0e6b;color:#fff;font-weight:bold;font-size:12px;padding:9px 14px;cursor:pointer')}>ask ✧</div>
        </div>

        <div style={css('font-family:Silkscreen,monospace;font-size:9px;color:#a86ce0')}>for entertainment purposes only. do not make life decisions based on this. or do</div>
      </div>
    </div>
  );
}
