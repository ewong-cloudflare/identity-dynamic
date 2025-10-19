/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      colors: {
        'blue': '#d9edf7',
        'CForange': '#ff7900',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#c8600c',
        'green': '#13ce66',
        'yellow': '#fcf8e3',
        'gray-dark': '#273444',
        'gray': '#e7e9ee',
        'gray-light': '#e1e4e9',
        'white': '#ffffff',
        'alertblue': '#31708f',
        'steel' : '#f7f7f8', 
        'alertred' : '#f2dede',
        'red' : '#E72929',
        'dark-red' :'#b62226',
        'warning' : '#8a6d3a',
        'alert-green' : '#88f78c',
        'alert-green2' : '#3d803f',
        'gunmetal' : '#292C36',
        'roman-silver' : '#8E99AC',
        'silver-sand' : '#BDC2C7', 
        'blue-silver' : '#2b2b34',
      link: '#ff7901',
      },
      variants: {
        extend: {
          textColor: ['hover'],
          backgroundColor: ['hover'],
        },
      },    
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      extend: {
        spacing: {
          '8xl': '96rem',
          '9xl': '128rem',
        },
        borderRadius: {
          '4xl': '2rem',
        }
      }
    },
  }