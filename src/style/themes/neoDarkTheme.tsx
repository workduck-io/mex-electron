import { generateTheme } from '../themeGenerator'
export const neoDark = generateTheme({
  // border-radius: 43px;
  // background: #c4cce0;
  // box-shadow:  13px 13px 26px #acb4c5,
  //              -13px -13px 26px #dce4fb;
  // Colors
  primary: '#4293F2',
  secondary: '#c31575',

  // Palettes
  gray: {
    1: '#E1E7F7', // Lightest for Light theme
    2: '#D9E0F1',
    3: '#B2BCD6',
    4: '#C4CCE0',
    5: '#A0ADCC',
    6: '#8997BA',
    7: '#606E8F',
    8: '#495571',
    9: '#1B1F3D',
    10: '#13162E' // Darkest for light theme
  },

  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#E1E7F7',
    default: '#B2BCD6',
    subheading: '#D9E0F1',
    fade: '#A0ADCC',
    disabled: '#9CA2BA',
    accent: '#CC7796',
    oppositePrimary: '#ffffff'
  },
  // backgroundImages: {
  //   app: 'https://i.imgur.com/Z2iNoSC.jpg'
  // },
  custom: 'NeoDarkStyles'
})

/*
//
//


*/
