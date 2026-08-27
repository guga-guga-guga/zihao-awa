export default function ToolIcon({ name }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 48 48',
    'aria-hidden': true,
  }

  switch (name) {
    case 'updream':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="updream" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff6ec7" />
              <stop offset="100%" stopColor="#7c5cd6" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="18" fill="url(#updream)" opacity=".25" />
          <text x="24" y="31" textAnchor="middle" fontSize="20" fontWeight="800" fill="url(#updream)">U</text>
        </svg>
      )

    case '即梦':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="32" height="32" rx="10" fill="#6ee7ff" opacity=".22" />
          <path d="M19 16v16l14-8-14-8Z" fill="#6ee7ff" />
        </svg>
      )

    case '可灵':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="32" height="32" rx="10" fill="#a78bfa" opacity=".22" />
          <path d="M16 16v16l14-8-14-8Z" fill="#a78bfa" />
          <path d="M14 34l6-6M34 14l-6 6" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )

    case 'C / C++':
      return (
        <svg {...common}>
          <text x="24" y="31" textAnchor="middle" fontSize="16" fontWeight="800" fill="#659ad2">C++</text>
        </svg>
      )

    case 'Python':
      return (
        <svg {...common}>
          <rect x="10" y="14" width="28" height="20" rx="6" fill="#3776ab" />
          <rect x="10" y="14" width="28" height="8" rx="6" fill="#ffd43b" />
          <path d="M18 22h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      )

    case 'Java':
      return (
        <svg {...common}>
          <text x="24" y="31" textAnchor="middle" fontSize="16" fontWeight="800" fill="#f89820">Java</text>
          <circle cx="38" cy="10" r="4" fill="#5382a1" />
        </svg>
      )

    case 'Blender':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" stroke="#ea7600" strokeWidth="3" fill="none" />
          <path d="M24 10l12 8-4 14H16l-4-14 12-8Z" fill="#ea7600" opacity=".18" />
          <text x="24" y="29" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ea7600">B</text>
        </svg>
      )

    case 'Unity':
      return (
        <svg {...common}>
          <path d="M24 6l16 28H8L24 6Z" fill="currentColor" opacity=".85" />
          <path d="M24 14l9 16H15l9-16Z" fill="var(--panel)" />
        </svg>
      )

    case 'Open Code':
      return (
        <svg {...common}>
          <rect x="8" y="10" width="32" height="28" rx="7" fill="#22c55e" opacity=".18" />
          <path d="M18 18l-6 6 6 6M30 18l6 6-6 6" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )

    case 'Codex':
      return (
        <svg {...common}>
          <rect x="8" y="10" width="32" height="28" rx="7" fill="currentColor" opacity=".12" />
          <path d="M17 18l-5 6 5 6M31 18l5 6-5 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M27 15l-6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      )

    case 'DSH':
      return (
        <svg {...common}>
          <path d="M8 28c4-10 12-16 24-16-2 12-10 20-20 18 4-3 6-8 7-12-3 4-8 6-11 10Z" fill="#4d8bf5" opacity=".85" />
          <text x="24" y="31" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">DSH</text>
        </svg>
      )

    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" fill="currentColor" opacity=".18" />
          <text x="24" y="31" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
            {name.slice(0, 2)}
          </text>
        </svg>
      )
  }
}
