import { generateTheme } from '../themeGenerator'

export const xemTheme = generateTheme({
  // Colors
  primary: '#55A2EA',
  secondary: '#128C7E',

  // Palettes
  gray: {
    10: '#11121B', // Darkest
    9: '#2b2e4a',
    8: '#363959',
    7: '#525579',
    6: '#71749A',
    5: '#878BAE',
    4: '#8F94C1',
    3: '#9BA5D8',
    2: '#B9C1D6',
    1: '#ffffff' // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#E4F1FF',
    default: '#B9C1D6',
    subheading: '#D1E5FB',
    fade: '#9aa2c9',
    disabled: '#72767D',
    accent: '#fe8019',
    oppositePrimary: '#1F2933'
  },
  custom: 'xemThemeStyles'
})
