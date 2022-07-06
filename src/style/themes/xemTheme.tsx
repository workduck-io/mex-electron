import { generateTheme } from '../themeGenerator'

export const xemTheme = generateTheme({
  // Colors
  primary: '#55A2EA',
  secondary: '#128C7E',

  // Palettes
  gray: {
    10: '#0F2238', // Darkest
    9: '#172B42',
    8: '#193454',
    7: '#354962',
    6: '#556C88',
    5: '#6A83A0',
    4: '#869EBA',
    3: '#A1B8D3',
    2: '#B4CAE3',
    1: '#C4DBF5' // Lightest
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
    fade: '#6B6F90',
    disabled: '#72767D',
    accent: '#fe8019',
    oppositePrimary: '#1F2933'
  },
  custom: 'xemThemeStyles'
})
