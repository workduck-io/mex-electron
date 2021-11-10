import React from 'react'
import useThemeStore from '../Editor/Store/ThemeStore'
import IconButton, { Button } from '../Styled/Buttons'
import { FlexBetween } from '../Spotlight/components/Actions/styled'
import { useSaveData } from '../Data/useSaveData'
import saveLine from '@iconify-icons/ri/save-line'
import toast from 'react-hot-toast'
import { Wrapper } from '../Styled/Layouts'
import { ButtonWrapper, Theme, ThemeColorDots, ThemeHeader, ThemePreview, ThemePreviews } from '../Styled/Settings'
import { ThemeProvider } from 'styled-components'

const Settings = () => {
  const themes = useThemeStore((state) => state.themes)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const saveData = useSaveData()

  const onSave = () => {
    // TODO: Only save settings data
    saveData()
    toast('Saved!', { duration: 1000 })
  }

  const onThemeSelect = (i: number) => {
    if (themes[i]) setTheme(themes[i])
  }

  return (
    <Wrapper>
      <FlexBetween>
        <h1>Themes</h1>
        <IconButton size={24} icon={saveLine} onClick={onSave} title="Save" />
      </FlexBetween>
      <h2>Current theme: {theme.id}</h2>
      <ThemePreviews>
        {themes.map((t, i) => {
          return (
            <ThemeProvider key={`mex_theme_key_${t.id}`} theme={t.themeData}>
              <Theme>
                <ThemeHeader>
                  <h1>{t.id}</h1>
                </ThemeHeader>
                <ThemePreview back={t.themeData.backgroundImages ? t.themeData.backgroundImages.app : undefined}>
                  <p>
                    <b>Theme is nice</b>
                  </p>
                  <p>This is your theme!</p>
                  <ThemeColorDots>
                    <div className="primary"></div>
                    <div className="secondary"></div>
                    <div className="text"></div>
                    <div className="text_fade"></div>
                    <div className="background"></div>
                  </ThemeColorDots>
                  <br />
                  <ButtonWrapper>
                    <Button primary={false} onClick={() => onThemeSelect(i)}>
                      Set
                    </Button>
                    <Button primary onClick={() => onThemeSelect(i)}>
                      Theme
                    </Button>
                  </ButtonWrapper>
                  <br />
                </ThemePreview>
              </Theme>
            </ThemeProvider>
          )
        })}
      </ThemePreviews>
    </Wrapper>
  )
}

export default Settings
