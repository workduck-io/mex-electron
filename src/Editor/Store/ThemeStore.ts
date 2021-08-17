import { DefaultTheme } from 'styled-components';
import create from 'zustand';
import { darkTheme, lightTheme, spotlightTheme } from '../../Styled/themes';

interface Theme {
  id: string;
  themeData: DefaultTheme;
}

interface ThemeStoreState {
  theme: Theme;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
  setThemes: (theme: Theme[]) => void;
}

const useThemeStore = create<ThemeStoreState>(set => ({
  theme: {
    id: 'Spotlight',
    themeData: spotlightTheme,
  },

  themes: [
    {
      id: 'dark',
      themeData: darkTheme,
    },
    {
      id: 'light',
      themeData: lightTheme,
    },
    {
      id: 'Spotlight',
      themeData: spotlightTheme,
    },
  ],

  setTheme: (theme: Theme) => {
    set({ theme });
  },

  setThemes: (themes: Theme[]) => {
    set({ themes });
  },
}));

export default useThemeStore;
