#!/usr/bin/env node
// Automated playtester for pixel-rocket.html.
// An autopilot flies every level along hand-placed waypoints, collecting all 3 stars and
// landing on the pad using the level's real fuel limit. At timed hazards ("w" waypoints) it
// hovers and repeatedly simulates ahead from a snapshot until it finds a safe moment to go.
//
// Usage:  NODE_PATH=$(npm root -g) node tools/pixel-rocket-playtest.cjs [levels...] [--inf] [--maps DIR]
//   levels  1-based level numbers (default: all)
//   --inf   ignore the fuel limit (to measure how much fuel a route needs)
//   --maps  write a PNG of each map with the flown path to DIR
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

// Waypoints in tile coordinates (pixel = tile * 8 + 4).
//   r: arrival radius (px)   v: max speed   w: k = wait here until the next k waypoints are safe
//   land: descend onto the pad centered on x
const ROUTES = {
  1: [{x:4,y:13},{x:10,y:11},{x:20,y:6},{x:29,y:11},{x:35,y:13},{x:35,land:1}],
  2: [{x:4,y:12},{x:10,y:10},{x:16,y:4},{x:20,y:3},{x:24,y:5},{x:28,y:14},{x:35,y:13},{x:35,land:1}],
  3: [{x:4,y:12},{x:8,y:6},{x:19,y:9},{x:24,y:15},{x:27,y:10},{x:27,y:4},{x:34,y:5},{x:34,land:1}],
  4: [{x:4,y:12},{x:11,y:6},{x:11,y:2.5,r:4},{x:11,y:6},{x:18,y:12},{x:25,y:11.5},{x:32,y:12},{x:37,y:15},
      {x:37,y:17.3,r:3,v:0.5},{x:37,y:14},{x:44,y:13},{x:44,land:1}],
  5: [{x:5,y:5},{x:12,y:2.5},{x:16.5,y:5},{x:16.5,y:14},{x:17,y:20},{x:23,y:24},{x:31,y:25},{x:33,y:19},
      {x:42,y:18},{x:55,y:16},{x:57,y:22},{x:57,land:1}],
  6: [{x:3,y:15},{x:6.5,y:13.5},{x:6.5,y:5},{x:15,y:5},{x:22.5,y:5},{x:22.5,y:14.5},{x:30,y:14.5},
      {x:38.5,y:14.5},{x:38.5,y:6},{x:45,y:5.5},{x:53,y:8},{x:53,land:1}],
  7: [{x:4,y:12},{x:8,y:10.5},{x:17,y:10},{x:23,y:11.5},{x:30,y:10.5},{x:37,y:11.5},{x:44,y:10.5},{x:50,y:6},
      {x:50,y:13},{x:50,land:1}],
  8: [{x:4,y:13},{x:12,y:14.5},{x:20,y:10},{x:27,y:9,w:2},{x:31,y:8},{x:31,y:3},{x:36,y:3},{x:35,y:4},{x:35,land:1}],
  9: [{x:4,y:12},{x:10,y:12,w:1},{x:19,y:9.5},{x:21,y:12,w:1},{x:29,y:13.5},{x:31,y:12,w:1},{x:41,y:11,w:1},
      {x:50,y:11},{x:57,y:11},{x:58,y:4.5},{x:58,y:10},{x:58,land:1}],
  10: [{x:3,y:9},{x:13,y:11},{x:16,y:5},{x:28,y:3.5},{x:32,y:4},{x:39,y:7},{x:40,y:16.5},{x:40,y:8},
       {x:46,y:4.5},{x:51,y:6},{x:51,land:1}],
  11: [{x:4,y:12},{x:12,y:4.5},{x:16,y:5},{x:24,y:8},{x:28,y:14},{x:34,y:13},{x:42,y:12},{x:45,y:6},
       {x:51,y:12},{x:51,land:1}],
  12: [{x:4,y:12},{x:6,y:4},{x:6,y:3.2,r:4},{x:14,y:10},{x:19,y:14},{x:26,y:14},{x:29,y:14.5},{x:30,y:8},
       {x:29,y:4},{x:33,y:5},{x:40,y:5},{x:44,y:4.5},{x:43,y:12},{x:43,land:1}],
  13: [{x:4,y:35},{x:12.5,y:35},{x:12.5,y:30},{x:12.5,y:16},{x:19,y:15.5},{x:14,y:15.5},{x:12.5,y:12},{x:12.5,y:5.5},{x:24,y:5},
       {x:31.5,y:6},{x:31.5,y:13},{x:36,y:13.5},{x:31.5,y:14},{x:31.5,y:24},{x:24,y:26},{x:24,land:1}],
  14: [{x:4,y:13},{x:7.5,y:11},{x:7.5,y:6},{x:7,y:3.5,r:4},{x:7.5,y:12},{x:16,y:13},{x:23.5,y:14},
       {x:23.5,y:19.5},{x:23.5,y:13},{x:27,y:12},{x:31,y:13},{x:38.5,y:12},{x:38.5,y:5.2},{x:38.5,y:12},
       {x:46,y:13},{x:53,y:8},{x:55,y:6},{x:53,y:10},{x:53,land:1}],
  15: [{x:4,y:10},{x:9,y:9},{x:16,y:8},{x:24,y:10},{x:25,y:12,w:1},{x:32,y:12},{x:35.5,y:9},{x:35.5,y:3.5,r:4},
       {x:35.5,y:9},{x:39,y:11},{x:43,y:11},{x:50,y:12},{x:56,y:12,w:1},{x:61,y:12},{x:66,y:8},{x:68,y:4},
       {x:66,y:9},{x:66,land:1}],
  16: [{x:4,y:10},{x:9,y:10,w:1},{x:16,y:7.5},{x:17,y:10,w:1},{x:24,y:10,w:2},{x:32,y:12.5},{x:33,y:10,w:1},
       {x:42,y:8},{x:49,y:8},{x:52,y:7.5},{x:51,y:9,w:1},{x:51,y:15},{x:51,land:1}],
  17: [{x:4,y:16},{x:8,y:5.5},{x:10,y:15,w:2},{x:20,y:15},{x:22,y:15},{x:24,y:12,w:3},{x:27,y:6.5},{x:33,y:7},
       {x:39.5,y:8},{x:40.5,y:13,w:2},{x:47,y:15},{x:50,y:6.5},{x:50,y:12},{x:50,land:1}],
  18: [{x:4,y:15},{x:8,y:10},{x:12,y:4.5},{x:20,y:4},{x:26,y:3.5},{x:31,y:5},{x:34,y:10,w:3},{x:38,y:14},
       {x:42,y:15},{x:46,y:15},{x:52,y:15},{x:55,y:15},{x:55,land:1}],
  19: [{x:4,y:15},{x:10,y:12},{x:16,y:11},{x:16,y:10},{x:21,y:13},{x:25,y:13},{x:29,y:10},{x:34,y:6},{x:39,y:6},
       {x:42,y:8,w:4},{x:46,y:15.5},{x:48.5,y:9},{x:49,y:3},{x:55,y:3},{x:55,land:1}],
  20: [{x:4,y:15},{x:9,y:8},{x:11,y:4.5},{x:11,y:10,w:1},{x:15,y:14},{x:17,y:16.5},{x:28,y:16.5},{x:32.5,y:15},
       {x:32.5,y:5},{x:38,y:5},{x:41,y:7,w:2},{x:42,y:14.5},{x:46,y:16},{x:50,y:16.5},{x:55,y:16.5},{x:58,y:16},
       {x:58,land:1}],
  21: [{x:4,y:11},{x:12,y:8.5},{x:16,y:10,w:1},{x:23,y:10,w:1},{x:31,y:11},{x:33.5,y:13},{x:33.5,y:17.5},
       {x:33.5,y:12},{x:37,y:11},{x:41,y:11,w:3},{x:46,y:13.5},{x:52,y:11},{x:58,y:12},{x:64,y:8},{x:68,y:4.5},
       {x:66,y:9},{x:66,land:1}],
  22: [{x:3,y:25},{x:6.5,y:24.5,r:2},{x:6.5,y:11,v:0.8},{x:10,y:11},{x:14.5,y:11},{x:14.5,y:15,v:0.5},
       {x:14.5,y:11,v:0.5},{x:17,y:11,w:1},{x:24.5,y:11},{x:24.5,y:21.5,v:0.8},{x:31,y:21.5},{x:36.5,y:21.5},
       {x:36.5,y:7,v:0.8},{x:44,y:7},{x:53,y:9},{x:56,y:8.5},{x:53,y:11},{x:53,land:1}],
  23: [{x:3,y:4},{x:6,y:3.2},{x:12,y:4},{x:12,y:15},{x:17,y:15.5,w:3},{x:26,y:15.5},{x:26,y:21.5},{x:29,y:18},
       {x:31.5,y:6},{x:38,y:5.5,w:2},{x:46,y:5.5},{x:53,y:6},{x:57,y:9},{x:57,land:1}],
  24: [{x:4,y:27},{x:9.5,y:26},{x:9.5,y:17.5,w:1},{x:9.5,y:12},{x:9.5,y:4.5},{x:18,y:4.5},{x:25,y:4.5},
       {x:25,y:1.8,r:3,v:0.5},{x:25,y:4.5,v:0.6},{x:32,y:4.5},{x:35.5,y:5},{x:35.5,y:8,w:2},{x:35.5,y:14},
       {x:35.5,y:21},{x:45,y:22.5},{x:50,y:25.3},{x:55,y:25},{x:59,y:21.5},{x:58,y:24},{x:58,land:1}],
  25: [{x:4,y:5.5},{x:10,y:5.5,w:1},{x:18,y:5.5,w:1},{x:27,y:5.5},{x:31,y:8},{x:34,y:8},{x:38,y:6},
       {x:40,y:5.5,w:1},{x:48,y:5.5,w:2},{x:55,y:5.5},{x:62,y:5.5},{x:65.5,y:6},{x:65.5,y:10.5},{x:65.5,y:6},
       {x:73,y:5.5},{x:80,y:5.5},{x:88,y:5.5},{x:88,y:12},{x:88,y:17},{x:80,y:16},{x:74,y:17,w:1},
       {x:68,y:18.5,w:1},{x:57,y:18.5},{x:55.5,y:15},{x:55.5,y:12.5},{x:55.5,y:16},{x:47,y:17,w:1},
       {x:37,y:18.8,w:1},{x:27,y:17},{x:20,y:16},{x:12,y:16},{x:8,y:17},{x:8,y:24},{x:12,y:29.5,w:1},
       {x:19,y:29.5,w:1},{x:26,y:28},{x:34,y:27.5},{x:42,y:29.5,w:1},{x:52,y:29.5},{x:63.5,y:30},
       {x:63.5,y:34.5},{x:63.5,y:30},{x:73,y:29.5,w:1},{x:88,y:29.5},{x:88,y:36},{x:88,y:42.5},{x:80,y:42.5},
       {x:72,y:42.5,w:1},{x:55,y:42.5,w:1},{x:49,y:42.5,w:1},{x:43,y:42.5,w:1},{x:36,y:42.5},{x:25,y:43.5},
       {x:14,y:42.5},{x:10,y:43},{x:10,land:1}]
};

// Runs inside the page.
function pageRun({ li, route, inf, maxFrames }) {
  const PR = window.__PR;
  PR.test(true);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const C = (v) => v * 8 + 4;

  function pilot(P, S, ignoreWaits) {
    const r = S.rocket;
    if (S.rest && S.rest.k === 'L') return {};
    const wp = route[P.i];
    if (!wp) return {};
    const env = PR.envAt(r.x, r.y);
    let vdx, vdy;
    if (wp.land) {
      const dx = C(wp.x) - r.x;
      vdx = clamp(dx * 0.05, -0.5, 0.5);
      vdy = Math.abs(dx) < 3 && Math.abs(r.vx) < 0.25 ? 0.5 : 0;
    } else {
      const dx = C(wp.x) - r.x, dy = C(wp.y) - r.y, d = Math.hypot(dx, dy);
      if (d < (wp.r || 5) && (!wp.w || P.go || ignoreWaits)) { P.i++; P.go = false; return pilot(P, S, ignoreWaits); }
      // Never go faster than we can brake: going up only gravity slows us, going down the thruster does.
      const ux = d > 0 ? dx / d : 0, uy = d > 0 ? dy / d : 0;
      // Gravity can change along the way (zones), so plan with the worst case of here and there.
      const e2 = PR.envAt(C(wp.x), C(wp.y)), e3 = PR.envAt((C(wp.x) + r.x) / 2, (C(wp.y) + r.y) / 2);
      const gLo = Math.min(env.gy, e2.gy, e3.gy), gHi = Math.max(env.gy, e2.gy, e3.gy);
      const decel = Math.abs(uy) * (uy < 0 ? Math.max(gLo, 0.002) : Math.max(PR.THR - gHi, 0.005)) + Math.abs(ux) * Math.max(gLo, 0.004) * 0.65;  // sideways braking ~ hover thrust * tan(tilt)
      const sp = Math.min(wp.v || 1.0, Math.sqrt(2 * decel * d) * 0.7 + 0.03, 0.04 * d + 0.08);
      vdx = ux * sp; vdy = uy * sp;
    }
    const kv = 0.1;
    // Thrust strength handles height, tilt handles sideways motion (classic lander control).
    const Tx = (vdx - r.vx) * kv - env.gx, Ty = (vdy - r.vy) * kv - env.gy;
    const tilt = wp.land ? 0.25 : 0.7;
    const da = clamp(Math.atan2(Tx, -Math.min(Ty, -0.002)), -tilt, tilt), err = da - r.a;
    const inp = {};
    if (err > PR.ROT * 0.5) inp.right = true; else if (err < -PR.ROT * 0.5) inp.left = true;
    const ca = Math.max(Math.cos(r.a), 0.3), sa = Math.sin(r.a);
    const fVert = -Ty / (PR.THR * ca);
    // Sideways braking may add thrust, but never so much that it accelerates us upward.
    const capV = r.vy < 0 ? Math.max(fVert, 0) : Math.max(env.gy, 0) / (PR.THR * ca);
    const fLat = Tx * sa > 0 && Math.abs(sa) > 0.05 ? Math.min(Math.abs(Tx) / (PR.THR * Math.abs(sa)), capV) : 0;
    let f = clamp(Math.max(fVert, fLat), 0, 1);
    P.acc += f;
    if (P.acc >= 1) { P.acc -= 1; inp.up = true; }
    return inp;
  }

  function atWp(S, wp) { return Math.hypot(C(wp.x) - S.rocket.x, C(wp.y) - S.rocket.y) < (wp.r || 5); }

  function safeToGo(P, k) {
    const snap = PR.snapshot();
    PR.sim(true);
    const Q = { i: P.i, acc: P.acc, go: true };
    const target = P.i + 1 + k;
    let ok = false;
    for (let n = 0; n < 1500; n++) {
      const S = PR.S;
      if (S.status === 'dead') break;
      if (Q.i >= target || S.status === 'complete') { ok = true; break; }
      PR.step(pilot(Q, S, true));
    }
    PR.restore(snap);
    PR.sim(false);
    return ok;
  }

  PR.load(li);
  if (inf) { PR.S.fuel = 1e9; PR.S.maxFuel = 1e9; }
  const P = { i: 0, acc: 0, go: false };
  const trail = [];
  let waited = 0;
  for (let fr = 0; fr < maxFrames; fr++) {
    const S = PR.S;
    if (fr % 3 === 0) trail.push([Math.round(S.rocket.x), Math.round(S.rocket.y)]);
    if (S.status === 'complete' || S.status === 'dead') break;
    const wp = route[P.i];
    if (wp && wp.w && !P.go && atWp(S, wp)) {
      waited++;
      if (waited % 4 === 0 && safeToGo(P, wp.w)) P.go = true;
    }
    PR.step(pilot(P, PR.S, false));  // PR.S, not S: a look-ahead restores a fresh object
  }
  const S = PR.S;
  return {
    status: S.status, t: S.t, wp: P.i, of: route.length,
    stars: S.stars.filter(s => s.got).length, nstars: S.stars.length,
    fuelUsed: (inf ? 1e9 : S.maxFuel) - S.fuel, fuel: PR.LV[li].fuel,
    x: Math.round(S.rocket.x), y: Math.round(S.rocket.y), tx: +(S.rocket.x / 8).toFixed(1), ty: +(S.rocket.y / 8).toFixed(1),
    vx: +S.rocket.vx.toFixed(2), vy: +S.rocket.vy.toFixed(2), a: +S.rocket.a.toFixed(2),
    trail
  };
}

// Draws the whole map plus hazard paths and the flown trail.
function pageMap({ li, trail, route }) {
  const PR = window.__PR;
  PR.load(li);
  const S = PR.S, L = PR.LV[li], PAL = ['#000000','#1d2b53','#7e2553','#008751','#ab5236','#5f574f','#c2c3c7','#fff1e8','#ff004d','#ffa300','#ffec27','#00e436','#29adff','#83769c','#ff77a8','#ffccaa'];
  const sc = 2, c = document.createElement('canvas');
  c.width = S.w * 8 * sc; c.height = S.h * 8 * sc;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.scale(sc, sc);
  g.fillStyle = PAL[L.th[0]]; g.fillRect(0, 0, S.w * 8, S.h * 8);
  g.drawImage(PR.layer, 0, 0);
  g.lineWidth = 0.5;
  for (const z of S.wd) { g.strokeStyle = '#29adff'; g.strokeRect(z[0] * 8, z[1] * 8, z[2] * 8, z[3] * 8); }
  for (const z of S.gz) { g.strokeStyle = z[4] < 1 ? '#00e436' : '#ff77a8'; g.strokeRect(z[0] * 8, z[1] * 8, z[2] * 8, z[3] * 8); }
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if ('ABC'.includes(S.grid[y][x])) { g.fillStyle = '#ffa300'; g.fillRect(x * 8, y * 8, 8, 8); }
  for (const s of S.stars) { g.fillStyle = '#ffec27'; g.fillRect(s.x - 3, s.y - 3, 6, 6); }
  for (const s of S.sw) { g.fillStyle = '#ff77a8'; g.fillRect(s.x - 3, s.y - 3, 6, 6); }
  for (const l of S.lz) { g.fillStyle = '#ff004d'; const cc = (l[3] ? l[0] : l[1]) * 8 + 3, a = (l[3] ? l[1] : l[0]) * 8; l[3] ? g.fillRect(cc, a, 2, l[2] * 8) : g.fillRect(a, cc, l[2] * 8, 2); }
  for (const m of S.mv) { const p0 = PR.mvPos(m, -m[7]), p1 = PR.mvPos(m, m[6] / 2 - m[7]); g.strokeStyle = '#c2c3c7'; g.strokeRect(p0.x, p0.y, p0.w, p0.h); g.strokeStyle = '#5f574f'; g.strokeRect(p1.x, p1.y, p1.w, p1.h); }
  for (const e of S.en) for (let t = 0; t < 400; t += 4) { const p = PR.enPos(e, t); g.fillStyle = '#ff004d'; g.fillRect(p.x - 0.5, p.y - 0.5, 1, 1); }
  g.fillStyle = '#ffffff';
  for (const [x, y] of trail) g.fillRect(x - 0.5, y - 0.5, 1, 1);
  g.fillStyle = '#00e436';
  for (const w of route) if (!w.land) g.fillRect(w.x * 8 + 3, w.y * 8 + 3, 2, 2);
  if (trail.length) { const [x, y] = trail[trail.length - 1]; g.strokeStyle = '#ff004d'; g.lineWidth = 1; g.strokeRect(x - 6, y - 6, 12, 12); }
  return c.toDataURL('image/png');
}

(async () => {
  const args = process.argv.slice(2);
  const inf = args.includes('--inf');
  const mi = args.indexOf('--maps');
  const mapDir = mi >= 0 ? args[mi + 1] : null;
  const levels = args.filter((a, i) => /^\d+$/.test(a) && args[i - 1] !== '--maps').map(Number);
  const list = levels.length ? levels : Array.from({ length: 25 }, (_, i) => i + 1);
  const file = path.resolve(__dirname, '..', 'pixel-rocket.html');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('file://' + file);
  await page.waitForFunction(() => !!window.__PR);
  let fails = 0;
  for (const n of list) {
    const route = ROUTES[n];
    const res = await page.evaluate(pageRun, { li: n - 1, route, inf, maxFrames: 60 * 300 });
    const ok = res.status === 'complete' && res.stars === 3 && res.nstars === 3;
    if (!ok) fails++;
    const fuel = inf ? `fuel used ${res.fuelUsed} (limit ${res.fuel}, ${(res.fuelUsed / res.fuel * 100).toFixed(0)}%)`
                     : `fuel left ${res.fuel - res.fuelUsed}/${res.fuel}`;
    console.log(`L${String(n).padStart(2)} ${ok ? 'PASS' : 'FAIL'} ${res.status.padEnd(8)} t=${(res.t / 60).toFixed(1)}s stars=${res.stars}/${res.nstars} ${fuel}` +
      (ok ? '' : `  @wp ${res.wp}/${res.of} tile(${res.tx},${res.ty}) v(${res.vx},${res.vy}) a=${res.a}`));
    if (mapDir) {
      fs.mkdirSync(mapDir, { recursive: true });
      const url = await page.evaluate(pageMap, { li: n - 1, trail: res.trail, route });
      fs.writeFileSync(path.join(mapDir, `level${String(n).padStart(2, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
    }
  }
  if (errors.length) { console.log('PAGE ERRORS:\n' + errors.join('\n')); fails++; }
  await browser.close();
  console.log(fails ? `${fails} problem(s)` : 'ALL LEVELS BEATEN');
  process.exit(fails ? 1 : 0);
})();
