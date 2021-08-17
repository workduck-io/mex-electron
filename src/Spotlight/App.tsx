import React from 'react';
import { ThemeProvider } from 'styled-components';
import Routes from './Routes';
import { theme } from './styles/theme';
import { SpotlightProvider } from './utils/context';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SpotlightProvider>
        <Routes />
      </SpotlightProvider>
    </ThemeProvider>
  );
}
