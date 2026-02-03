import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0A4C86',
          blueDark: '#203B43',
          orange: '#E36A1B',
          ink: '#0B1220',
          steel: '#2A3A52',
          mist: '#F3F6FA'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      },
      letterSpacing: {
        tightest: '-0.04em'
      }
    }
  },
  plugins: []
};

export default config;
