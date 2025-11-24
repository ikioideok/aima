/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Shippori Mincho', 'Zen Old Mincho', 'serif'],
                eng: ['Inter', 'sans-serif'],
            },
            transitionTimingFunction: {
                'ink': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                }
            },
            animation: {
                'float-slow': 'float 7s ease-in-out infinite',
                'float-medium': 'float 5s ease-in-out infinite',
                'float-fast': 'float 4s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
