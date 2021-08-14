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
    tiny: '0.25rem',
  },
  width: {
    nav: 48,
    sidebar: 350,
  },
  indent: {
    sidebar: 8,
  },
};

export const palette = {
  p1: '#cc5d6f',
  b0: '#0f111a',
  b1: '#161824',
  b2: '#191d2c',
  b3: '#202331',
  b4: '#1d233d',
};

export const darkTheme: DefaultTheme = {
  ...LayoutTheme,
  colors: {
    primary: palette.p1,
    secondary: '#8158e0',
    background: {
      app: palette.b0,
      surface: palette.b1,
      card: palette.b2,
      sidebar: palette.b0,
      spotlight: '#1F2947',
      highlight: palette.b4,
      input: palette.b2,
    },
    palette: {
      white: '#ecdbdb',
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
      s9: palette.b0,
      sb: '#000000',
    },
    border: {
      divider: '#ffffff10',
      input: '#1F2947',
    },
    fade: {
      primary: '#b32768',
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
    primary: '#34be79',
    secondary: '#2b76cc',
    background: {
      spotlight: '#dcf3ee',
      app: '#ffffff',
      card: '#dcf3ee',
      surface: '#e2faf0',
      sidebar: '#e2faf3',
      highlight: '#00a179',
      input: '#8bbb9b',
    },
    palette: {
      white: '#fff',
      black: '#000',
      green: '#9fe732',
      yellow: '#d4a348',
      red: '#ff4f58',
    },
    gray: {
      sb: '#ffffff',
      s9: '#e2eee5',
      s8: '#b8cfc2',
      s7: '#7dc39d',
      s6: '#8bbb9b',
      s5: '#e0f1e0',
      s4: '#bbcac1',
      s3: '#1F2947',
      s2: '#091744',
      s1: '#13192e',
      s0: '#040015',
      sw: '#000000',
    },
    border: {
      divider: '#00000010',
      input: '#7dc39d',
    },
    fade: {
      primary: '#b9e7d0',
      secondary: '#4dd0e1',
      background: '#dbc5c5',
    },
    text: {
      primary: '#2a2e46',
      default: '#404666',
      secondary: '#6a779b',
      disabled: '#919191',
      accent: '#5b94ff',
    },
  },
};

export const spotlightTheme: DefaultTheme = {
  ...LayoutTheme,

  colors: {
    primary: '#5b94ff',
    secondary: '#4dd0e1',
    background: {
      spotlight: '#f4f8ff',
      app: '#fff',
      card: '#a3c3fd',
      surface: '#e5eeff',
      sidebar: '#f4f8ff',
      highlight: '#5b8de9',
      input: '#a3c3fd',
    },
    palette: {
      white: '#fff',
      black: '#000',
      green: '#9fe732',
      yellow: '#d4a348',
      red: '#ff4f58',
    },
    gray: {
      sb: '#ffffff',
      s9: '#e2e5ee',
      s8: '#b8bfcf',
      s7: '#7d9bc3',
      s6: '#8b9ebb',
      s5: '#e0e5f1',
      s4: '#bbc1ca',
      s3: '#1F2947',
      s2: '#091744',
      s1: '#13192e',
      s0: '#040015',
      sw: '#000000',
    },
    border: {
      divider: '#00000010',
      input: '#7fa0dd',
    },
    fade: {
      primary: '#e5eeff',
      secondary: '#4dd0e1',
      background: '#dbc5c5',
    },
    text: {
      primary: '#2a2e46',
      default: '#404666',
      secondary: '#6a779b',
      disabled: '#919191',
      accent: '#5b94ff',
    },
  },
};
