import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        brand: {
          50: '#FFF8E8',
          100: '#FDE6B1',
          200: '#FCD486',
          300: '#F9BE56',
          400: '#F5A524',
          500: '#EC8B00',
          600: '#CC7300',
          700: '#9E5800',
          900: '#24170A',
        },
        accent: '#F59E0B',
        ink: '#0B0D11',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 30px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
