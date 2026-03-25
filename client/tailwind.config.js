/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0F1115",
                card: "#18181B",
                header: "#18181B",
                primary: "#6366F1", // Indigo
                secondary: "#4B5563",
                success: "#10B981",
                warning: "#F59E0B",
                danger: "#EF4444",
                muted: "#27272A",
                text: {
                    primary: "#F9FAFB",
                    secondary: "#9CA3AF",
                    muted: "#6B7280"
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
