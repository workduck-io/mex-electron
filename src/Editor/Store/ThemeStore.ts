import { devTheme } from '../../Styled/themes/devTheme';
import { DefaultTheme } from 'styled-components';
import create from 'zustand';
import { darkTheme, lightTheme, spotlightTheme } from '../../Styled/themes';
import { defaultThemes } from '../../Styled/themes/defaultThemes';

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
    id: 'dev',
    themeData: devTheme,
  },

  themes: defaultThemes,

  setTheme: (theme: Theme) => {
    set({ theme });
  },

  setThemes: (themes: Theme[]) => {
    set({ themes });
  },
}));

export default useThemeStore;
