import { DefaultTheme } from 'styled-components'
import { LayoutStyle } from '../styled'

const LayoutTheme: LayoutStyle = {
  spacing: {
    large: '2rem',
    medium: '1rem',
    small: '0.5rem',
    tiny: '0.25rem'
  },
  borderRadius: {
    large: '1rem',
    small: '0.5rem',
    tiny: '0.25rem'
  },
  width: {
    nav: 48,
    sidebar: 350
  },
  indent: {
    sidebar: 8
  }
}

export const palette = {
  p1: '#cc5d6f',
  b0: '#0f111a',
  b1: '#161824',
  b2: '#191d2c',
  b3: '#202331',
  b4: '#1d233d'
}

export const spotlightTheme: DefaultTheme = {
  ...LayoutTheme,

  colors: {
    primary: '#5b94ff',
    secondary: '#4dd0e1',
    background: {
      app: '#fff',
      card: '#a3c3fd',
      modal: '#e5eeff',
      sidebar: '#f4f8ff',
      highlight: '#5b8de9'
    },
    palette: {
      white: '#fff',
      black: '#000',
      green: '#9fe732',
      yellow: '#d4a348',
      red: '#ff4f58'
    },
    gray: {
      1: '#b8bccf',
      2: '#7D90C3',
      3: '#5e6c92',
      4: '#2e364e',
      5: '#1c2744',
      6: '#1F2947',
      7: '#091744',
      8: '#d0d1d4',
      9: palette.b0,
      10: '#000000'
    },
    form: {
      input: {
        bg: palette.b1,
        fg: palette.b2,
        border: palette.p1
      },
      button: {
        bg: palette.b1,
        fg: palette.b2,
        border: palette.p1,
        hover: palette.b3
      }
    },
    divider: '#00000010',
    fade: {
      primary: '#e5eeff',
      secondary: '#4dd0e1',
      background: '#dbc5c5'
    },
    text: {
      heading: '#2a2e46',
      default: '#404666',
      subheading: '#6a779b',
      disabled: '#696969',
      accent: '#5b94ff',
      fade: '#5b94ff',
      oppositePrimary: '#000'
    }
  }
}
