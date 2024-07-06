/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	fontFamily: {
		sans: ["Inter", "sans-serif"],
	},
	theme: {
		extend: {
			colors: {
				cGreen: {
					DEFAULT: "rgb(124, 194, 112)",
					dark: "rgb(102, 174, 89)",
					light: "rgb(165, 221, 155)",
					lightTrans: "rgba(165, 221, 155, 0.5)",
				},
			},
		},
	},
	plugins: [],
};
