let ctx = null;
let muted = localStorage.getItem('burger-muted') === '1';

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur = 0.12, type = 'sine', vol = 0.15, slideTo = null, delay = 0) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur);
}

export const SFX = {
  pick()    { tone(440, 0.06, 'triangle'); },
  drop()    { tone(220, 0.10, 'square', 0.10, 110); },
  error()   { tone(150, 0.20, 'sawtooth', 0.12, 90); },
  angry()   { tone(300, 0.40, 'sawtooth', 0.12, 80); },
  coin()    { tone(988, 0.08, 'square', 0.08); tone(1319, 0.18, 'square', 0.08, null, 0.08); },
  success() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.15, 'triangle', 0.15, null, i * 0.08)); },
    isMuted() { return muted; },
  toggleMute() {
    muted = !muted;
    try { localStorage.setItem('burger-muted', muted ? '1' : '0'); } catch {}
    return muted;
  }
};