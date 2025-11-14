/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "qorange": {
                    default: "var(--primary)",
                    hover: "var(--primary-hover)",
                    text: "#ffffff",
                },
                "qblue": {
                    default: '#3b82f6',
                    hover: '#2563eb',
                    text: "#ffffff",
                },
                "qyellow": {
                    default: "var(--secondary)",
                    hover: "var(--secondary-hover)",
                    text: "#000000",
                },
            },
        },
    },
};
