import { darkTheme, lightTheme, spotlightTheme } from '../themes';
import { devTheme } from './devTheme';
import { vvkTheme } from './vvkTheme';

export const defaultThemes = [
  { id: 'dev', themeData: devTheme },
  { id: 'vvk', themeData: vvkTheme },
  { id: 'dark', themeData: darkTheme },
  { id: 'light', themeData: lightTheme },
  { id: 'Spotlight', themeData: spotlightTheme },
];
