import React from 'react'
import useThemeStore from '../Editor/Store/ThemeStore'
import IconButton, { Button } from '../Styled/Buttons'
import { FlexBetween } from '../Spotlight/components/Actions/styled'
import { useSaveData } from '../Data/useSaveData'
import saveLine from '@iconify-icons/ri/save-line'
import toast from 'react-hot-toast'

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
    <div>
      <FlexBetween>
        <h1>Settings</h1>
        <IconButton size={24} icon={saveLine} onClick={onSave} title="Save" />
      </FlexBetween>
      <hr />
      <h2>Current theme: {theme.id}</h2>
      <hr />
      <div className="Themes">
        {themes.map((t, i) => (
          <div key={`mex_theme_key_${t.id}`}>
            <h1>{t.id}</h1>
            <Button onClick={() => onThemeSelect(i)}>Set Theme</Button>
          </div>
        ))}
      </div>
      <br />
      <br />
    </div>
  )
}

export default Settings
