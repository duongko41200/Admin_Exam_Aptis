module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        myShadow1: "4.1px -5px 0 0 rgb(17,24,39)",
        myShadow2: "-4.1px -5px 0 0 rgb(17,24,39)",
      },
      colors: {
        'bnt-word': '#53a07966',
        'btn-sentence':'#50cbed66'
      }
      
    },
  },
  plugins: [],
};
