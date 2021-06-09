import { DefaultTheme } from 'styled-components';
import { LayoutStyle } from '../styled';

const LayoutTheme: LayoutStyle = {
  spacing: {
    large: '2rem',
    medium: '1rem',
    small: '0.5rem',
    tiny: '0.25rem',
  },
  borderRadius: {
    large: '1rem',
    small: '0.5rem',
  },
  width: {
    nav: 48,
    sidebar: 350,
  },
  indent: {
    sidebar: 8,
  },
};

export const darkTheme: DefaultTheme = {
  ...LayoutTheme,
  colors: {
    primary: '#4284ff',
    secondary: '#4dd0e1',
    background: {
      app: '#040015',
      surface: '#13192e',
      card: '#1F2947',
      sidebar: '#091744',
    },
    palette: {
      white: '#fff',
      black: '#000',
      green: '#9fe732',
      yellow: '#FFCB6B',
      red: '#ff4f58',
    },
    gray: {
      sw: '#ffffff',
      s0: '#e2e4ee',
      s1: '#b8bccf',
      s2: '#7D90C3',
      s3: '#5e6c92',
      s4: '#2e364e',
      s5: '#1c2744',
      s6: '#1F2947',
      s7: '#091744',
      s8: '#13192e',
      s9: '#040015',
      sb: '#000000',
    },
    border: {
      divider: '#ffffff10',
    },
    fade: {
      primary: '#1c65ec',
      secondary: '#4dd0e1',
      background: '#030303',
    },
    text: {
      primary: '#e2e4ee',
      default: '#b8bccf',
      secondary: '#7D90C3',
      disabled: '#5d5d6d',
      accent: '#82aeff',
    },
  },
};

// TODO: Add light theme colors
export const lightTheme: DefaultTheme = {
  ...LayoutTheme,

  colors: {
    primary: '#5b94ff',
    secondary: '#4dd0e1',
    background: {
      app: '#161F2F',
      card: '#202c3f',
      surface: '#1B2537',
      sidebar: '#1B2537',
    },
    palette: {
      white: '#fff',
      black: '#000',
      green: '#9fe732',
      yellow: '#FFCB6B',
      red: '#ff4f58',
    },
    gray: {
      s0: '#7D90C3',
      s1: '#7D90C3',
      s2: '#7D90C3',
    },
    border: {
      divider: '#ffffff10',
    },
    fade: {
      primary: '#4e8cff',
      secondary: '#4dd0e1',
      background: '#030303',
    },
    text: {
      primary: '#e2e4ee',
      default: '#e2e4ee',
      secondary: '#7D90C3',
      disabled: '#5d5d6d',
      accent: '#5b94ff',
    },
  },
};
