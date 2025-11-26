/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                background: 'var(--color-background)',
                surface: 'var(--color-surface)',
                gradientStart: 'var(--color-gradient-start)',
                gradientEnd: 'var(--color-gradient-end)',
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
