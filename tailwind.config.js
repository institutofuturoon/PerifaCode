/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        'from-brand-purple',
        'to-brand-pink',
        'from-[#8a4add]',
        'to-[#f27983]',
        'bg-gradient-to-r',
        'bg-gradient-to-br',
        'shadow-brand-purple/30',
        'shadow-[#8a4add]/30',
    ],
    theme: {
        extend: {
            colors: {
                // Cores dinâmicas do sistema
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                background: 'var(--color-background)',
                surface: 'var(--color-surface)',
                gradientStart: 'var(--color-gradient-start)',
                gradientEnd: 'var(--color-gradient-end)',

                // Paleta de marca (cores fixas)
                brand: {
                    blue: '#034c8c',
                    orange: '#f28705',
                    navy: '#112140',
                    red: '#d01717',
                    beige: '#f2d194',
                    gold: '#d99204',
                    cyan: '#05a7f2',
                    purple: '#8a4add',
                    pink: '#f27983',
                },

                // Estados semânticos
                success: '#10b981',
                warning: '#f2d194',
                error: '#d01717',
                info: '#034c8c',
            },
            borderRadius: {
                'base': 'var(--radius-base)',
            },
            animation: {
                'infinite-scroll': 'infinite-scroll 40s linear infinite',
            },
            keyframes: {
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
}
