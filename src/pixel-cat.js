(function () {
  if (customElements.get('pixel-cat')) return;

  const PAL = { D: '#3b2a33', O: '#e8914a', o: '#b8612a', K: '#2b2b2b', W: '#ffffff', E: '#2b2b2b', P: '#f5a0b8' };
  const HEAD = [
    '..............D...D.',
    '.D...........DOD.DKD',
    'DOD..........DOOWKKD',
    'DOD..........DOEWWED',
    '.DOD.DDDDDDDDDWWPWWD',
    '...DOoOWWKKWWWWWWWD.',
    '...DOOoWWKKWWWWDDD..',
    '...DWOOWWWWWOOWD....',
    '...DWWWWWWWWWWWD....',
    '....DWWDDDDDWWD.....'
  ];
  const WALK_A = HEAD.concat(['....DWD.....DWD.....', '....DDD.....DDD.....']);
  const WALK_B = HEAD.concat(['.....DWD...DWD......', '.....DDD...DDD......']);
  const SIT = [
    '....................',
    '..............D...D.',
    '.............DOD.DKD',
    '.............DOOWKKD',
    '.............DOEWWED',
    '...D........DWWPWWD.',
    '..DOD......DOOWWWD..',
    '..DOD.....DOoKKWWD..',
    '...DOD...DOOoKKWWD..',
    '....DODDDOOWWWWWWD..',
    '.....DWWWWWWWWWWWD..',
    '.....DDDDDDDDDDDDD..'
  ];
  const SLEEP = [
    '....................',
    '....................',
    '..............D...D.',
    '....DDDDDDDD.DOD.DKD',
    '...DOOoWWKKKDDOOWKKD',
    '..DOoOWWWKKWWDODWWDD',
    '.DOOOWWWWWWWWDWWPWWD',
    '.DWOOWWWWWWWWWDWWWD.',
    '.DWWWWWWWWWWWWWDDD..',
    '.DDOOOWWWWWWWWWWD...',
    '..DDDDDDDDDDDDDDDD..',
    '....................'
  ];
  const GPAL = { G: '#3fa34d', g: '#2d7a38', L: '#7ed36f', R: '#ff4fd8', r: '#c2168f', Y: '#ffe14d', y: '#d9a400', B: '#6ef7ff', b: '#1c9fb0', W: '#ffffff', S: '#8a5a3c', s: '#6b4430' };
  const GARDEN = [
    '....R.............Y.................B..............R........Y.....',
    '...RYR...........YyY...............BWB............RYR......YyY....',
    '....R.....W.......Y.......R.........B.......W......R........Y.....',
    '....G....WYW......G......RYR........G......WYW.....G........G.....',
    '..L.G.L...W....L..G..L....R....L....G..L....W...L..G..L.....G..L..',
    '..GLGLG...G...LGL.GLGL....G...LGL..LGLGL....G..LGLLG.LGL...LGLGL..',
    'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
    'gGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgG',
    'SsSSsSSSsSSsSSSsSSsSSSsSSsSSSsSSsSSSsSSsSSSsSSsSSSsSSsSSSsSSsSSSsS'
  ];
  const svg = (rows, pal, w, h) => {
    let r = '';
    rows.forEach((row, y) => [...row].forEach((c, x) => { if (pal[c]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>`; }));
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" preserveAspectRatio="none">${r}</svg>`);
  };
  const S = 3;
  const IMG = { a: svg(WALK_A, PAL, 20, 12), b: svg(WALK_B, PAL, 20, 12), sit: svg(SIT, PAL, 20, 12), sleep: svg(SLEEP, PAL, 20, 12) };
  const GARDEN_IMG = svg(GARDEN, GPAL, 66, 9);
  const W = 20 * S, H = 12 * S;
  const FISH = [
    '..........DD',
    '.DDDDDD..DBD',
    'DBWBBBBDDBBD',
    'DBKBbBbBBBD.',
    'DBBBBBBDDBBD',
    '.DDDDDD..DBD',
    '..........DD'
  ];
  const FISH_IMG = svg(FISH, { D: '#1d3557', B: '#6ef7ff', b: '#1c9fb0', W: '#ffffff', K: '#1d3557' }, 12, 7);
  const BALL_CSS = `position:absolute;left:146px;bottom:10px;width:24px;height:14px;background:url("${FISH_IMG}") center / 100% 100% no-repeat;image-rendering:pixelated;cursor:grab;touch-action:none;z-index:3`;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  class PixelCat extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      const live = window.__pearlCat;
      if (live && live !== this && live.orphan) {
        // Home page came back: take over the garden from whichever element had it last
        this.style.display = 'block';
        const from = live.shell || live;
        while (from.firstChild) this.append(from.firstChild);
        live.orphan = false; live.shell = this;
        return;
      }
      window.__pearlCat = this;
      this.style.display = 'block';
      const bed = document.createElement('div');
      bed.style.cssText = `position:relative;height:118px;border:2px dashed #e0169b;background:#fff4fb url("${GARDEN_IMG}") center bottom / 100% 30px no-repeat;image-rendering:pixelated;display:flex;align-items:flex-end;justify-content:flex-start;padding:0 0 13px 48px;box-sizing:border-box;cursor:pointer;user-select:none`;
      const sign = document.createElement('div');
      sign.style.cssText = "position:absolute;top:6px;left:8px;font-family:'Comic Sans MS',cursive;font-size:12px;color:#a3127a;transform:rotate(-4deg)";
      sign.textContent = 'pet me ♡';
      const cushion = document.createElement('div');
      cushion.style.cssText = 'position:absolute;left:28px;bottom:8px;width:100px;height:18px;background:#d62839;border:3px solid #6b0f1a;box-sizing:border-box;box-shadow:inset 0 5px 0 #ff5a5f,inset 0 -3px 0 #9e1b2a';
      const zz = document.createElement('div');
      zz.style.cssText = 'position:absolute;left:112px;top:30px;font-family:Silkscreen,monospace;font-size:11px;color:#5b2a86';
      const bowl = document.createElement('div');
      bowl.setAttribute('data-cat-bowl', '1');
      bowl.title = "kitty's bowl";
      bowl.style.cssText = 'position:absolute;right:26px;bottom:12px;width:40px;height:16px';
      bowl.innerHTML = '<div style="position:absolute;left:6px;right:6px;top:0;height:6px;border-radius:50%;background:#b8612a;box-shadow:inset 0 -2px 0 #8a4a1f"></div><div style="position:absolute;left:0;right:0;top:3px;bottom:0;background:#ff4fd8;border:2px solid #3b2a33;border-radius:3px 3px 16px 16px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-family:Silkscreen,monospace;font-size:6px;line-height:1;color:#fff;letter-spacing:0.05em">chow</div>';
      bowl.style.cursor = 'pointer';
      bowl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.mode === 'bed') this.wake();
        this.bubble('!!');
        this.goEat(1.9);
      });
      const ball = document.createElement('div');
      ball.title = 'throw the fish!';
      ball.style.cssText = BALL_CSS;
      const hint = document.createElement('div');
      hint.textContent = '↑ throw';
      hint.style.cssText = "position:absolute;left:146px;top:100%;margin-top:3px;font-family:'Comic Sans MS',cursive;font-size:11px;font-weight:bold;color:#000;white-space:nowrap;pointer-events:none";
      bed.style.marginBottom = '20px';
      bed.append(sign, cushion, zz, bowl, ball, hint);
      this.ball = ball;
      ball.addEventListener('click', (e) => e.stopPropagation());
      ball.addEventListener('pointerdown', (e) => this.grabBall(e));
      this.append(bed);

      const cat = document.createElement('div');
      cat.style.cssText = `position:relative;z-index:2;width:${W}px;height:${H}px;cursor:pointer;touch-action:none`;
      const img = document.createElement('img');
      img.alt = 'calico cat'; img.draggable = false;
      img.style.cssText = `width:${W}px;height:${H}px;display:block;image-rendering:pixelated;pointer-events:none`;
      cat.append(img);
      bed.append(cat);

      Object.assign(this, { bed, sign, zz, cat, img });
      this.mode = 'bed'; this.dir = 1; this.frame = 0;
      this.setSprite('sleep');

      bed.addEventListener('click', () => { if (this.mode === 'bed') this.wake(); else this.goHome(); });
      cat.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.mode === 'bed') { this.wake(); return; }
        this.hearts();
        this.bubble(pick(['prrr', 'mrrp', '♡ purr ♡', 'meow']));
        if (this.mode === 'walk') this.startIdle('sit', rand(2500, 4000));
        else this.until += 1500;
      });
      this._zzI = setInterval(() => {
        this.zz.textContent = this.mode === 'bed' ? (this.zz.textContent.length > 4 ? 'z' : this.zz.textContent + ' z') : '';
        if (this.mode === 'nap' && Math.random() < 0.5) this.bubble('z z');
      }, 700);
      this.zz.textContent = 'z';
      const loop = () => { this._raf = requestAnimationFrame(loop); this.step(); };
      this._raf = requestAnimationFrame(loop);
    }
    disconnectedCallback() {
      // The page holding the garden went away. `self` is the original cat,
      // even when this element is a later shell that adopted its garden.
      const self = window.__pearlCat;
      if (!self || (self !== this && self.shell !== this)) return;
      if (self === this && this.shell && this.shell.isConnected) return;
      self.orphan = true;
      self.catLeftBed();
    }
    catLeftBed() {
      if (this.mode === 'bed') {
        requestAnimationFrame(() => {
          if (!this.orphan || this.mode !== 'bed') return;
          const A = this.area();
          this.x = A.l + 40; this.y = A.t;
          this.cat.style.cssText = `position:absolute;z-index:2;left:0;top:0;width:${W}px;height:${H}px;cursor:pointer;touch-action:none;will-change:transform`;
          document.body.append(this.cat);
          this.acts = 0;
          this.walkTo(A.l + 40 + rand(100, 500), A.t + rand(20, 200), 'sit', 2.2);
          this.bubble('wait for me!');
        });
      }
    }
    setSprite(k) { if (this._spr !== k) { this._spr = k; this.img.src = IMG[k]; } }
    area() {
      const el = document.querySelector('[data-cat-area]') || document.body;
      const r = el.getBoundingClientRect();
      return { l: r.left + scrollX + 10, r: r.right + scrollX - W - 10, t: r.top + scrollY + 60, b: r.bottom + scrollY - H - 20 };
    }
    wake() {
      this.hearts();
      const r = this.cat.getBoundingClientRect();
      if (r.width) { this.x = r.left + scrollX; this.y = r.top + scrollY; }
      this.cat.style.cssText = `position:absolute;z-index:2;left:0;top:0;width:${W}px;height:${H}px;cursor:pointer;touch-action:none;will-change:transform`;
      document.body.append(this.cat);
      this.sign.textContent = 'out exploring… click to call home';
      this.acts = 0;
      this.startIdle('sit', 900);
      this.bubble('*yawn*');
    }
    goHome() {
      if (!this.bed.isConnected) { this.acts = 0; this.startIdle('nap', rand(4000, 7000)); return; }
      const r = this.bed.getBoundingClientRect();
      this.walkTo(r.left + scrollX + 50, r.bottom + scrollY - H - 15, 'home', 1.8);
    }
    settle() {
      this.mode = 'bed';
      this.cat.style.cssText = `position:relative;z-index:2;width:${W}px;height:${H}px;cursor:pointer;touch-action:none`;
      this.bed.append(this.cat);
      this.setSprite('sleep'); this.img.style.transform = '';
      this.sign.textContent = 'pet me ♡';
    }
    walkTo(x, y, then, speed) {
      this.mode = 'walk'; this.goal = { x, y, then }; this.speed = speed || rand(0.7, 1.4);
    }
    startIdle(kind, ms) { this.mode = kind; this.until = performance.now() + ms; }
    grabBall(e) {
      e.preventDefault(); e.stopPropagation();
      const b = this.ball, r = b.getBoundingClientRect();
      this.carrying = false; this.ballV = null;
      this.bx = r.left + scrollX; this.by = r.top + scrollY;
      b.style.cssText = b.style.cssText.replace(/position:[^;]+;|left:[^;]+;|bottom:[^;]+;|top:[^;]+;|z-index:[^;]+;/g, '') + ';position:absolute;left:0;top:0;z-index:9002;cursor:grabbing';
      document.body.append(b);
      this.placeBall();
      const hist = [{ x: e.pageX, y: e.pageY, t: performance.now() }];
      const ox = e.pageX - this.bx, oy = e.pageY - this.by;
      const move = (ev) => {
        this.bx = ev.pageX - ox; this.by = ev.pageY - oy; this.placeBall();
        hist.push({ x: ev.pageX, y: ev.pageY, t: performance.now() }); if (hist.length > 6) hist.shift();
      };
      const up = () => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
        b.style.cursor = 'grab';
        const a = hist[0], z = hist[hist.length - 1], dt = Math.max(16, z.t - a.t);
        let vx = (z.x - a.x) / dt * 16, vy = (z.y - a.y) / dt * 16;
        if (Math.hypot(vx, vy) < 2) { vx = (Math.random() < 0.5 ? -1 : 1) * 9; vy = -7; } // a click = gentle toss
        const cap = 38, m = Math.hypot(vx, vy); if (m > cap) { vx *= cap / m; vy *= cap / m; }
        this.ballV = { x: vx, y: vy };
        this.bubble('!!');
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    }
    placeBall() { this.ball.style.transform = `translate(${this.bx}px,${this.by}px)`; }
    ballPhysics() {
      if (!this.ballV) return;
      const A = this.area(), v = this.ballV;
      const minX = A.l, maxX = A.r + W - 24, minY = A.t - 40, maxY = A.b + H - 14;
      this.bx += v.x; this.by += v.y;
      if (this.bx < minX) { this.bx = minX; v.x = Math.abs(v.x) * 0.7; }
      if (this.bx > maxX) { this.bx = maxX; v.x = -Math.abs(v.x) * 0.7; }
      if (this.by < minY) { this.by = minY; v.y = Math.abs(v.y) * 0.7; }
      if (this.by > maxY) { this.by = maxY; v.y = -Math.abs(v.y) * 0.7; }
      v.x *= 0.955; v.y *= 0.955;
      this.ball.style.transform = `translate(${this.bx}px,${this.by}px) rotate(${Math.sin((this.bx + this.by) / 18) * 35}deg)${v.x < 0 ? ' scaleX(-1)' : ''}`;
      if (Math.hypot(v.x, v.y) < 0.35) {
        this.ballV = null;
        if (this.mode === 'bed') this.wake();
        this.walkTo(this.bx - (this.bx > this.x ? W - 12 : 2), this.by - H + 14, 'fetch', 2.6);
      }
    }
    returnBall() {
      const b = this.ball;
      b.style.cssText = BALL_CSS;
      this.bed.append(b);
    }
    goEat(speed) {
      const bowl = this.querySelector('[data-cat-bowl]') || document.querySelector('[data-cat-bowl]');
      if (!bowl) return false;
      const r = bowl.getBoundingClientRect();
      this.walkTo(r.left + scrollX - W + 8, r.bottom + scrollY - H + 2, 'eat', speed);
      return true;
    }
    nextActivity() {
      this.acts++;
      if (this.acts > 9) { this.bubble('sleepy…'); this.goHome(); return; }
      const A = this.area();
      const roll = Math.random();
      if (roll < 0.45) {
        // wander a short-ish distance, like a real cat
        const nx = Math.max(A.l, Math.min(A.r, this.x + rand(-260, 260)));
        const ny = Math.max(A.t, Math.min(A.b, this.y + rand(-160, 160)));
        this.walkTo(nx, ny, pick(['sit', 'sit', 'look', 'none']));
      } else if (roll < 0.62) {
        if (!this.goEat()) this.startIdle('sit', 2000);
      } else if (roll < 0.74) {
        const boxes = [...document.querySelectorAll('[data-cat-hide]')].filter(b => b.offsetParent);
        if (!boxes.length) { this.startIdle('sit', 2000); return; }
        const r = pick(boxes).getBoundingClientRect();
        this.walkTo(r.left + scrollX + rand(20, Math.max(21, r.width - W - 20)), r.top + scrollY - H * 0.5, 'peek');
      } else if (roll < 0.88) {
        this.startIdle('groom', rand(2500, 4500)); this.bubble(pick(['*licks paw*', '*grooms*', '*stretches*']));
      } else {
        this.startIdle('nap', rand(5000, 9000));
      }
    }
    step() {
      this.ballPhysics();
      if (this.mode === 'bed') return;
      const now = performance.now();
      if (this.mode === 'walk') {
        const g = this.goal, dx = g.x - this.x, dy = g.y - this.y, d = Math.hypot(dx, dy);
        if (d < 1.5) {
          this.x = g.x; this.y = g.y;
          if (g.then === 'home') { if (this.bed.isConnected) { this.settle(); return; } this.startIdle('sit', 1500); }
          if (g.then === 'fetch') {
            if (this.ballV || this.ball.parentNode !== document.body) { this.startIdle('sit', 800); }
            else {
              this.carrying = true; this.bubble('fish!!');
              if (!this.bed.isConnected) { this.carrying = false; this.startIdle('sit', 2000); this.bubble('mine now'); return; }
              const hr = this.bed.getBoundingClientRect();
              this.walkTo(hr.left + scrollX + 150 - W + 6, hr.bottom + scrollY - H - 10, 'drop', 1.7);
              this.carryBall(); return;
            }
          }
          if (g.then === 'drop') { this.carrying = false; this.returnBall(); this.dir = -1; this.startIdle('sit', 2500); this.bubble('again?'); this.renderCat(); return; }
          if (g.then === 'eat') { this.dir = 1; this.startIdle('eat', rand(3000, 5000)); this.bubble('mmm'); }
          else if (g.then === 'peek') this.startIdle('peek', rand(2500, 4500));
          else if (g.then === 'look') { this.dir *= -1; this.startIdle('sit', rand(1200, 2200)); }
          else if (g.then === 'sit') this.startIdle('sit', rand(1500, 3500));
          else this.startIdle('stand', rand(500, 1200));
        } else {
          const sp = Math.min(this.speed, d);
          this.x += dx / d * sp; this.y += dy / d * sp;
          if (Math.abs(dx) > 0.3) this.dir = dx > 0 ? 1 : -1;
          this.frame++; this.setSprite((this.frame >> 3) % 2 ? 'b' : 'a');
        }
        if (this.carrying) this.carryBall();
      } else {
        if (this.mode === 'nap') this.setSprite('sleep');
        else if (this.mode === 'sit' || this.mode === 'groom') this.setSprite('sit');
        else if (this.mode === 'eat') { this.frame++; this.setSprite((this.frame >> 4) % 2 ? 'a' : 'sit'); if (this.frame % 70 === 0) this.bubble('mmm'); }
        else this.setSprite('a');
        if (this.mode === 'groom') { this.frame++; if (this.frame % 40 === 0) this.dir *= -1; }
        if (now > this.until && !this.ballV) this.nextActivity();
      }
      this.renderCat();
    }
    renderCat() {
      this.cat.style.transform = `translate(${this.x}px,${this.y}px)`;
      this.img.style.transform = this.dir < 0 ? 'scaleX(-1)' : '';
    }
    carryBall() {
      this.bx = this.dir > 0 ? this.x + W - 10 : this.x - 4; this.by = this.y + 20;
      this.placeBall();
    }
    hearts() {
      const r = this.cat.getBoundingClientRect();
      for (let i = 0; i < 4; i++) {
        const h = document.createElement('div');
        h.textContent = '♥';
        h.style.cssText = `position:fixed;z-index:9001;left:${r.left + W / 2 - 6 + (i - 1.5) * 12}px;top:${r.top - 4}px;color:${i % 2 ? '#ff4fd8' : '#e0169b'};font-size:${12 + (i % 2) * 4}px;pointer-events:none;transition:transform 1s ease-out, opacity 1s ease-out`;
        document.body.append(h);
        requestAnimationFrame(() => { h.style.transform = `translate(${(i - 1.5) * 8}px,-${34 + i * 6}px)`; h.style.opacity = '0'; });
        setTimeout(() => h.remove(), 1100);
      }
    }
    bubble(txt) {
      const b = document.createElement('div');
      b.textContent = txt;
      b.style.cssText = `position:absolute;z-index:9001;left:${W - 6}px;top:-22px;white-space:nowrap;background:#fff;border:2px solid #3b2a33;border-radius:8px;padding:1px 6px;font-family:'Comic Sans MS',cursive;font-size:11px;color:#3b2a33;pointer-events:none`;
      this.cat.append(b);
      setTimeout(() => b.remove(), 1400);
    }
  }
  customElements.define('pixel-cat', PixelCat);
})();
