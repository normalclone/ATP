/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html,ts}'],
  theme: {
    extend: {
      colors: {
        // Nền
        bg: 'var(--bg)',
        'bg-deep': 'var(--bg-deep)',
        'bg-elev': 'var(--bg-elev)',
        line: 'var(--line)',

        // Chữ
        text: 'var(--text)',
        'text-dim': 'var(--text-dim)',
        'text-soft': 'var(--text-soft)',
        'text-mute': 'var(--text-mute)',
        'text-faint': 'var(--text-faint)',
        'text-badge-primary': 'var(--text-badge-primary)',
        'text-badge-success': 'var(--text-badge-success)',
        'text-badge-warn': 'var(--text-badge-warn)',
        'text-badge-danger': 'var(--text-badge-danger)',

        // Border / overlay
        'border-soft': 'var(--border-soft)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',
        'overlay-glass': 'var(--overlay-glass)',

        // Brand & state
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-soft': 'var(--primary-soft)',
        'primary-border': 'var(--primary-border)',

        success: 'var(--success)',
        'success-soft': 'var(--success-soft)',
        'success-border': 'var(--success-border)',

        warn: 'var(--warn)',
        'warn-soft': 'var(--warn-soft)',
        'warn-border': 'var(--warn-border)',

        danger: 'var(--danger)',
        'danger-alt': 'var(--danger-alt)',
        'danger-hover': 'var(--danger-hover)',
        'danger-soft': 'var(--danger-soft)',
        'danger-border': 'var(--danger-border)',
      },

      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
      },

      boxShadow: {
        soft: 'var(--shadow-soft)',
      },

      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-mono)'],
      },

      fontSize: {
        xs: ['var(--fs-xs)', { lineHeight: 'var(--lh-snug)' }],
        sm: ['var(--fs-sm)', { lineHeight: 'var(--lh-normal)' }],
        base: ['var(--fs-base)', { lineHeight: 'var(--lh-normal)' }],
        md: ['var(--fs-md)', { lineHeight: 'var(--lh-normal)' }],
        lg: ['var(--fs-lg)', { lineHeight: 'var(--lh-snug)' }],
        xl: ['var(--fs-xl)', { lineHeight: 'var(--lh-snug)' }],
        '2xl': ['var(--fs-2xl)', { lineHeight: 'var(--lh-tight)' }],
      },
    },
  },
  plugins: [],
};
