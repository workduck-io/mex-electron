import React from 'react'
import { defaultThemes } from '../Styled/themes/defaultThemes'
import { ThemeProvider } from 'styled-components'
import useThemeStore from '../Editor/Store/ThemeStore'

const Providers: React.FC = ({ children }) => {
  const theme = useThemeStore((state) => state.theme)
  // const [theme] = React.useState<'dark' | 'light'>('dark');

  return <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>{children}</ThemeProvider>
}

export default Providers
