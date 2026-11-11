/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F3EFE5',
          50: '#FBF9F4',
          100: '#F3EFE5',
          200: '#E9E3D3',
          300: '#DDD5C0',
          400: '#CDC3AA',
          500: '#B5AA8E',
          600: '#948A70',
          700: '#766D57',
          800: '#59524A',
          900: '#3D3A33',
        },
        ink: {
          DEFAULT: '#252B2B',
          50: '#F2F4F4',
          100: '#E2E6E6',
          200: '#CDD2D2',
          300: '#7D8585',
          400: '#5E6666',
          500: '#555F5F',
          600: '#444D4D',
          700: '#353D3D',
          800: '#1E2323',
          900: '#252B2B',
        },
        gold: {
          50: '#FAF6EC',
          100: '#F4EBD5',
          200: '#EADAB2',
          300: '#DFC68F',
          400: '#D4B57D',
          500: '#C5A66A',
          600: '#A8864A',
          700: '#8A6B36',
          800: '#6B5229',
          900: '#4A3920',
        },
        sky: {
          50: '#EEF5F9',
          100: '#DCEBF3',
          200: '#B9D7E6',
          300: '#94C2D8',
          400: '#75A8C2',
          500: '#5E94AE',
          600: '#4B7C94',
          700: '#3B6378',
          800: '#2D4D5E',
          900: '#1F3645',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      // Warm, layered shadows tinted with the cream-900 tone instead of pure black
      boxShadow: {
        soft: '0 1px 2px rgb(61 58 51 / 0.04), 0 8px 24px -12px rgb(61 58 51 / 0.12)',
        lift: '0 2px 4px rgb(61 58 51 / 0.05), 0 24px 48px -20px rgb(61 58 51 / 0.28)',
        glow: '0 0 0 4px rgb(197 166 106 / 0.18)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(100deg, #8A6B36, #C5A66A 45%, #8A6B36)',
        'ink-fade': 'linear-gradient(180deg, #252B2B, #1E2323)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'page-enter': 'pageEnter 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'reveal-up': 'revealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'reveal-left': 'revealLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'reveal-right': 'revealRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'reveal-scale': 'revealScale 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'stagger-in': 'staggerIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        // new
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        draw: 'draw 1.6s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        'grow-x': 'growX 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        pop: 'pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'pulse-ring': 'pulseRing 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        confetti: 'confetti 1.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        shake: 'shake 0.45s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealLeft: {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        revealRight: {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        revealScale: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        staggerIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        draw: {
          to: { strokeDashoffset: '0' },
        },
        growX: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { opacity: '0.7', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.6)' },
        },
        confetti: {
          '0%': { opacity: '1', transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': {
            opacity: '0',
            transform: 'translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--r))',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
      },
    },
  },
  plugins: [],
};
