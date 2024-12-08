// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // pages 디렉토리
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // components 디렉토리
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // app 디렉토리
  ],
  theme: {
    extend: {
      colors: {
        gray:{
          200: "#777", // 겁나 진한 회색 (검정에 가까움) (약간 콘크리트색)
          300: "#a2a2a2", // 회색(약간 연함)
          400: "#d0d0d0", // 흰색에 가까운 회색
        },
        blacks: {
          100: "#424242", // 왕진함 근데 회색에 가까움
          200: "#292929",
          300: "#000", //검정


        },

        background: "var(--background)", // 사용자 정의 색상
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
