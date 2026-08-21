import type { Config } from 'tailwindcss'

/**
 * NEUBRUTALISM design system:
 * - High-contrast palette: Soft Pastel Cream (#FDFBF7), Electric Yellow (#FFD200), Royal Blue (#2B52FF), Mint Green (#10B981), Coral Red (#FF5A36)
 * - Heavy black borders (2px - 3px solid black)
 * - Zero-blur hard offset shadows (2px, 3px, 4px, 6px)
 * - Clean geometric sans-serif fonts
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FDFBF7',
        surface: {
          DEFAULT: '#FFFFFF',
          dim: '#F3F4F6',
          bright: '#FFFFFF',
          'container-lowest': '#FFFFFF',
          'container-low': '#FFFFFF',
          container: '#FFFFFF',
          'container-high': '#F9FAFB',
          'container-highest': '#F3F4F6',
          variant: '#E5E7EB',
        },
        'on-surface': '#000000',
        'on-surface-variant': '#4B5563',
        outline: {
          DEFAULT: '#000000',
          variant: '#000000',
        },
        primary: {
          DEFAULT: '#FFD200', // Electric Yellow
          container: '#FFD200',
          fixed: '#FFE043',
          'fixed-dim': '#E6BE00',
        },
        'on-primary': '#000000',
        secondary: {
          DEFAULT: '#2B52FF', // Royal Blue
          container: '#2B52FF',
        },
        'on-secondary': '#FFFFFF',
        error: {
          DEFAULT: '#FF5A36', // Coral Red
          container: '#FF5A36',
        },
        'on-error': '#FFFFFF',
        mint: '#10B981',
        coral: '#FF5A36',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        pixel: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['44px', { lineHeight: '48px' }],
        'headline-lg': ['32px', { lineHeight: '36px' }],
        'headline-mobile': ['28px', { lineHeight: '32px' }],
        'title-md': ['20px', { lineHeight: '24px' }],
        'body-lg': ['16px', { lineHeight: '22px' }],
        'body-sm': ['14px', { lineHeight: '18px' }],
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      spacing: {
        gutter: '16px',
        margin: '20px',
        nav: '80px',
      },
      maxWidth: {
        app: '480px',
      },
      boxShadow: {
        pixel: '4px 4px 0px #000000',
        'pixel-sm': '3px 3px 0px #000000',
        'pixel-xs': '2px 2px 0px #000000',
        'pixel-lg': '6px 6px 0px #000000',
        modal: '6px 6px 0px #000000',
      },
    },
  },
  plugins: [],
} satisfies Config
