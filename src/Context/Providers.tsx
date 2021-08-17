import React from 'react';
import { ThemeProvider } from 'styled-components';
import useThemeStore from '../Editor/Store/ThemeStore';
import { darkTheme } from '../Styled/themes';

const Providers: React.FC = ({children}) => {
  const theme = useThemeStore(state => state.theme);
  // const [theme] = React.useState<'dark' | 'light'>('dark');

  return <ThemeProvider theme={theme?.themeData ?? darkTheme}>{children}</ThemeProvider>;
}

export default Providers;
