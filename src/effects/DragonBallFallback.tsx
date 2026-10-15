const starPoints = '0,-8 2.35,-2.9 7.6,-2.5 3.8,1 4.7,6.5 0,3.2 -4.7,6.5 -3.8,1 -7.6,-2.5 -2.35,-2.9'

export function DragonBallFallback() {
  return (
    <svg className="dragon-ball-fallback" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="dragon-ball-amber" cx="32%" cy="25%" r="76%">
          <stop offset="0" stopColor="#ffdc83" />
          <stop offset="0.55" stopColor="#fbb044" />
          <stop offset="0.85" stopColor="#e58922" />
          <stop offset="1" stopColor="#9f4315" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="#ffc968" strokeWidth="0.65" opacity="0.5">
        <ellipse cx="50" cy="50" rx="57" ry="20" transform="rotate(-24 50 50)" />
        <ellipse cx="50" cy="50" rx="54" ry="22" transform="rotate(37 50 50)" />
      </g>
      <circle cx="50" cy="50" r="44" fill="url(#dragon-ball-amber)" stroke="#fdc66e" strokeWidth="0.6" />
      {[[-11, -11], [11, -11], [-11, 11], [11, 11]].map(([x, y]) => (
        <polygon key={`${x}-${y}`} points={starPoints} transform={`translate(${50 + x} ${50 + y})`} fill="#c62224" />
      ))}
      <ellipse cx="32" cy="27" rx="7" ry="11" fill="#fff5d3" opacity="0.3" transform="rotate(30 32 27)" />
      <path d="M70 77 Q77 74 80 67" fill="none" stroke="#ffedb4" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
    </svg>
  )
}
