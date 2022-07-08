import { generateTheme } from '../themeGenerator'

export const xemTheme = generateTheme({
  // Colors
  primary: '#2D9EDF',
  secondary: '#128C7E',

  // Palettes
  gray: {
    10: '#0F2238', // Darkest
    9: '#1E2124',
    8: '#2F3740',
    7: '#40444B',
    6: '#4E525A',
    5: '#646A75',
    4: '#8E9096',
    3: '#A3AEBD',
    2: '#D1D3DA',
    1: '#FFFFFF' // Lightest
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
    default: '#C4DBF5',
    subheading: '#D1E5FB',
    fade: '#A1B8D3',
    disabled: '#72767D',
    accent: '#fe8019',
    oppositePrimary: '#ffffff'
  },
  custom: 'MexStyles'
})
