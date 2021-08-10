import * as React from 'react';
import { Combobox } from '../../combobox/components/Combobox';
import { ComboboxKey, useComboboxStore } from '../../combobox/useComboboxStore';
import { useILinkOnSelectItem } from '../hooks/useILinkOnSelectItem';
import { ILinkComboboxItem } from './ILinkComboboxItem';

export const ILinkComboboxComponent = () => {
  const onSelectItem = useILinkOnSelectItem();

  return <Combobox onSelectItem={onSelectItem as any} onRenderItem={ILinkComboboxItem} />;
};

export const ILinkCombobox = () => {
  const key = useComboboxStore(state => state.key);

  return (
    <div style={key !== ComboboxKey.ILINK ? { display: 'none' } : {}}>
      <ILinkComboboxComponent />
    </div>
  );
};
