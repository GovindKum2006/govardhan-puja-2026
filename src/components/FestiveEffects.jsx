import React, { useMemo } from 'react';

export default function FestiveEffects() {
  // Generate a small, deterministic array of lightweight petals & golden particles
  const petals = useMemo(() => {
    const emojis = ['🏵️', '🌼', '✨', '🏵️', '🌼'];
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(i * 7.2 + 3) % 96}%`,
      animationDuration: `${12 + (i % 6) * 2.5}s`,
      swayDuration: `${3 + (i % 4)}s`,
      delay: `${(i * 1.3) % 10}s`,
      size: `${14 + (i % 3) * 6}px`,
      opacity: 0.65 + (i % 4) * 0.08
    }));
  }, []);

  const sparkles = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: `${(i * 9.5 + 4) % 94}%`,
      top: `${(i * 8.5 + 10) % 80}%`,
      size: `${4 + (i % 3) * 3}px`,
      delay: `${(i * 0.7) % 4}s`,
      duration: `${2.5 + (i % 3) * 0.8}s`
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-20 select-none">
      {/* Floating Marigold Petals */}
      {petals.map(p => (
        <span
          key={p.id}
          className="floating-petal select-none"
          style={{
            left: p.left,
            top: '-30px',
            fontSize: p.size,
            animationDuration: `${p.animationDuration}, ${p.swayDuration}`,
            animationDelay: `${p.delay}, ${p.delay}`,
            opacity: p.opacity,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Subtle Golden Star Twinkles */}
      {sparkles.map(s => (
        <div
          key={`sparkle-${s.id}`}
          className="golden-particle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration
          }}
        />
      ))}
    </div>
  );
}
