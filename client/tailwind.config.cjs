module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-dark': '#1D4ED8',
        'primary-light': '#DCE8FF',
        success: '#22C55E',
        warning: '#FACC15',
        error: '#EF4444',
        'text-main': '#1E293B',
        'text-muted': '#64748B',
        'card-bg': '#FFFFFF',
        'light-gray-bg': '#F1F5F9'
      },
      boxShadow: {
        'card-md': '0 2px 8px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px'
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}
