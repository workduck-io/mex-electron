import { generateTheme } from '../themeGenerator'

export const mexTheme = generateTheme({
  // Colors
  primary: '#EB4B63',
  secondary: '#5E8FF1',

  // Palettes
  gray: {
    10: '#1E1E1E', // Darkest
    9: '#24202E',
    8: '#2d244b',
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
    oppositePrimary: '#282828'
  }
})
