/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 리액트 프로젝트의 소스 코드 경로
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['MapleFont'], // 사용자 정의 폰트를 추가합니다.
      },
    },
  },
  plugins: [],
}
