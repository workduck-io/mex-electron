import { Theme, ThemeColorDots, ThemeHeader, ThemePreview, ThemePreviews } from '../../../style/Settings'

import { AppType } from '../../../hooks/useInitialize'
import { IpcAction } from '../../../data/IpcAction'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Wrapper } from '../../../style/Layouts'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { useSaveData } from '../../../hooks/useSaveData'
import useThemeStore from '../../../store/useThemeStore'
import { useTransition } from 'react-spring'

const Themes = () => {
  const themes = useThemeStore((state) => state.themes)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const { saveData } = useSaveData()

  const transition = useTransition(themes, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    keys: (item) => item.id,
    trail: 100,
    duration: 300,
    config: {
      mass: 1,
      tension: 200,
      friction: 16
    }
  })

  const onThemeSelect = (i: number) => {
    if (themes[i]) {
      appNotifierWindow(IpcAction.SET_THEME, AppType.MEX, { theme: themes[i] })
      setTheme(themes[i])
    }

    saveData()
  }

  return (
    <Wrapper>
      <ThemePreviews>
        {transition((styles, t, _t, i) => {
          return (
            <ThemeProvider key={`mex_theme_key_${t.id}`} theme={t.themeData}>
              <Theme selected={t.id === theme.id} onClick={() => onThemeSelect(i)} style={styles}>
                <ThemePreview back={t.themeData.backgroundImages ? t.themeData.backgroundImages.preview : undefined}>
                  <ThemeColorDots>
                    <div className="primary"></div>
                    <div className="secondary"></div>
                    <div className="text"></div>
                    <div className="text_fade"></div>
                    <div className="background"></div>
                  </ThemeColorDots>
                  <br />
                </ThemePreview>
                <ThemeHeader>
                  <h4>{t.id}</h4>
                </ThemeHeader>
              </Theme>
            </ThemeProvider>
          )
        })}
      </ThemePreviews>
    </Wrapper>
  )
}

export default Themes
