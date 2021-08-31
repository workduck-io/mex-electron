import { generateTheme } from '../themeGenerator'

export const spotlightTheme = generateTheme({
  // Colors
  primary: '#5b94ff',
  secondary: '#2b76cc',

  // Palettes
  gray: {
    10: '#ffffff', // Surface
    9: '#a3c3fd',
    8: '#e5eeff',
    7: '#f4f8ff',
    6: '#a3cdfd',
    5: '#8b9aac',
    4: '#647386',
    3: '#455966',
    2: '#2a3241',
    1: '#161c24' // Text
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#ff3b30'
  }
  // text: {
  //   heading: '#CBCDD2',
  //   default: '#A6ACCD',
  //   subheading: '#abafc7',
  //   fade: '#9196B3',
  //   disabled: '#7f8288',
  //   accent: '#C792EA',
  // },
})
