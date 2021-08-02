import React from 'react';
import useThemeStore from '../Editor/Store/ThemeStore';
import { Button } from '../Styled/Buttons';

const Settings = () => {
  const themes = useThemeStore((state) => state.themes);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const onThemeSelect = (i: number) => {
    if (themes[i]) setTheme(themes[i]);
  };

  return (
    <div>
      <h1>Settings</h1>
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
    </div>
  );
};

export default Settings;
