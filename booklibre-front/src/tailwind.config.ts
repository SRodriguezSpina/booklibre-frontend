import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#577c8e",
                secondary: "#2f4157",
                background: "#f4efeb",
                accent: "#c7d9e5",
                surface: "#ffffff",
            },
        },
    },
    plugins: [],
};

export default config;