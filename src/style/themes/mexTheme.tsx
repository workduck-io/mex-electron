import { generateTheme } from '../themeGenerator'

export const mexTheme = generateTheme({
  // Colors
  primary: '#0576B9',
  secondary: '#128C7E',

  // Palettes
  gray: {
    10: '#212121', // Darkest
    9: '#2d244b',
    8: '#1F2933',
    7: '#322D3E',
    6: '#473E65',
    5: '#9F99B7',
    4: '#B3ADC9',
    3: '#CCC8DA',
    2: '#E2E0EB',
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
    heading: '#ffffff',
    default: '#fafafa',
    subheading: '#CCC8DA',
    fade: '#9F99B7',
    disabled: '#72767D',
    accent: '#fe8019',
    oppositePrimary: '#ffffff'
  }
})
