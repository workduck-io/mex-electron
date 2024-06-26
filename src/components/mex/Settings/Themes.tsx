import { useUserService } from '@services/auth/useUserService'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { defaultThemes } from '@style/themes/defaultThemes'
import React from 'react'
import { useTransition } from 'react-spring'
import { ThemeProvider } from 'styled-components'
import { useSaveData } from '../../../hooks/useSaveData'
import { Theme, ThemeColorDots, ThemeHeader, ThemePreview, ThemePreviews } from '../../../style/Settings'

const Themes = () => {
  const themes = defaultThemes
  const theme = useUserPreferenceStore((state) => state.theme)
  const setTheme = useUserPreferenceStore((state) => state.setTheme)

  const { saveData } = useSaveData()
  const { updateUserPreferences } = useUserService()

  const transition = useTransition(themes, {
    from: {
      opacity: 0,
      transform: 'translate3d(-100px,0,0) scale(0.5) '
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0px,0,0) scale(1) '
    },
    keys: (item) => item.id,
    trail: 50,
    duration: 100,
    config: {
      mass: 1,
      tension: 100,
      friction: 16
    }
  })

  const onThemeSelect = (i: number) => {
    if (themes[i]) {
      // appNotifierWindow(IpcAction.SET_THEME, AppType.MEX, { theme: themes[i] })
      setTheme(themes[i].id)
    }

    updateUserPreferences()
  }

  return (
    <ThemePreviews>
      {transition((styles, t, _t, i) => {
        return (
          <ThemeProvider key={`mex_theme_key_${t.id}`} theme={t.themeData}>
            <Theme selected={t.id === theme} onClick={() => onThemeSelect(i)} style={styles}>
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
  )
}

export default Themes
