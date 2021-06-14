import React from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../Styled/themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme] = React.useState<'dark' | 'light'>('dark');

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </ThemeProvider>
  );
}
