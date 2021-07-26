import React from 'react';
import { useComboboxControls } from '../combobox/hooks/useComboboxControls';
import { ILinkCombobox } from '../ilink/components/ILinkCombobox';

// Handle multiple combobox
export const ComboboxContainer = () => {
  useComboboxControls();

  // return <TagCombobox />;
  return <ILinkCombobox />;
};
