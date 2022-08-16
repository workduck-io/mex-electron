import React, { useMemo } from 'react'
import { defaultThemes } from '../../style/themes/defaultThemes'
import { ThemeProvider } from 'styled-components'
// import useThemeStore from '../../store/useThemeStore'
import { useUserPropertiesStore } from '@store/userPropertiesStore'

const Providers: React.FC = ({ children }) => {
  const theme = useUserPropertiesStore((state) => state.theme)
  // const [theme] = React.useState<'dark' | 'light'>('dark');

  const themeData = useMemo(() => {
    const ctheme = defaultThemes.find((t) => t.id === theme)
    return ctheme ? ctheme.themeData : defaultThemes[0].themeData
  }, [theme])

  return <ThemeProvider theme={themeData}>{children}</ThemeProvider>
}

export default Providers
