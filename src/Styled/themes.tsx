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
      surface: '#0C1121',
      card: '#1F2947',
      sidebar: '#091744',
    },
    palette: {
      green: '#9fe732',
      yellow: '#FFCB6B',
      red: '#ff4f58',
    },
    gray: {
      light: '#7D90C3',
      gray: '#5f6d92',
      dark: '#1c2744',
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
      green: '#9fe732',
      yellow: '#FFCB6B',
      red: '#ff4f58',
    },
    gray: {
      light: '#7D90C3',
      gray: '#7D90C3',
      dark: '#7D90C3',
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
      secondary: '#7D90C3',
      disabled: '#5d5d6d',
      accent: '#5b94ff',
    },
  },
};
