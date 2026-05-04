import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // Cognitio+ brand palette
        cognitio: {
          primary: '#b425aa',
          secondary: '#c80ec9',
          gold: '#D4AF37',
          ink: '#1F1235',
          mist: '#F7F3FB',
        },
        // User type ramps
        'c-purple': {
          50: '#FBF2FA', 100: '#F4DEF1', 200: '#E8B9E2', 300: '#D680CB',
          400: '#C24DB6', 500: '#b425aa', 600: '#8E1B85', 700: '#6B1463',
          800: '#480D43', 900: '#2A0826'
        },
        'c-teal': {
          50: '#EFFBFA', 100: '#D4F4F1', 200: '#A6E7E1', 300: '#6FD4CC',
          400: '#3BBCB3', 500: '#14A299', 600: '#0E7F78', 700: '#0A605B',
          800: '#06403D', 900: '#03201F'
        },
        'c-green': {
          50: '#F0FAF1', 100: '#D7F1DA', 200: '#AEE2B5', 300: '#7CCD89',
          400: '#4FB561', 500: '#2F9C45', 600: '#247936', 700: '#1B5A28',
          800: '#123C1B', 900: '#091D0D'
        },
        'c-amber': {
          50: '#FDF8EB', 100: '#FAEDC6', 200: '#F2D77F', 300: '#E5BD51',
          400: '#D4AF37', 500: '#B5921D', 600: '#8E7115', 700: '#6A5410',
          800: '#46380A', 900: '#231C05'
        },
        'c-coral': {
          50: '#FEF2F0', 100: '#FCDCD6', 200: '#F8B4A8', 300: '#F38876',
          400: '#EE6048', 500: '#E03B22', 600: '#B12C18', 700: '#852012',
          800: '#58150C', 900: '#2C0B06'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['"Roboto Condensed"', 'Inter', 'sans-serif'],
        display: ['Poppins', 'Montserrat', 'sans-serif'],
        body: ['"Roboto Condensed"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'calc(var(--radius) + 2px)',
        md: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in': { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'slide-up': { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'pulse-soft': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in': 'slide-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      backgroundImage: {
        'cognitio-gradient': 'linear-gradient(135deg, #b425aa 0%, #c80ec9 50%, #D4AF37 100%)',
        'cognitio-soft': 'linear-gradient(135deg, #F7F3FB 0%, #FDF8EB 100%)',
      },
      typography: {
        DEFAULT: { css: { maxWidth: 'none' } },
      },
    }
  },
  plugins: [animate, typography],
} satisfies Config;
