// Synthesized Web Audio API Temple Bell / Chime
export function playTempleBell() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Harmonic frequencies for a rich bronze temple bell
    const frequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const decayTime = 2.5 - idx * 0.4;
      gain.gain.setValueAtTime(0.3 / (idx + 1), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decayTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + decayTime);
    });
  } catch (err) {
    console.warn('Audio playback not permitted or supported:', err);
  }
}
