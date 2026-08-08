/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'from-blue-500', 'to-blue-600',
    'from-blue-500', 'to-indigo-600',
    'from-violet-500', 'to-purple-600',
    'from-purple-500', 'to-pink-600',
    'from-rose-500', 'to-pink-600',
    'from-red-500', 'to-rose-600',
    'from-orange-500', 'to-amber-600',
    'from-amber-500', 'to-yellow-600',
    'from-emerald-500', 'to-green-600',
    'from-teal-500', 'to-cyan-600',
    'from-cyan-500', 'to-sky-600',
    'from-sky-500', 'to-blue-600',
    'from-slate-500', 'to-slate-600',
    'from-neutral-500', 'to-stone-600',
    'from-indigo-500', 'to-purple-600',
    'from-teal-500', 'to-indigo-600',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',
          secondary: '#0F172A',
          accent: '#38BDF8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px -8px rgba(37, 99, 235, .35)',
        'soft': '0 4px 24px -8px rgba(15, 23, 42, .08)',
        'card': '0 8px 40px -12px rgba(15, 23, 42, .12)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
