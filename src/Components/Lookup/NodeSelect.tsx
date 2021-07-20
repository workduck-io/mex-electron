import React, { useState } from 'react';
import { ActionMeta } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { ThemeConfig } from 'react-select/src/theme';
import { useTheme } from 'styled-components';
import useDataStore, {
  useFlatTreeFromILinks,
} from '../../Editor/Store/DataStore';
import { useEditorStore } from '../../Editor/Store/EditorStore';
import { getNodeFlatTree, getOptions } from '../../Lib/flatTree';

type Value = {
  label: string;
  value: string;
};

interface SelectState {
  isLoading: boolean;
  options: { label: string; value: string }[];
  value: Value | null;
}

interface LookupInputProps {
  closeModal: () => void;
}

const LookupInput = ({ closeModal }: LookupInputProps) => {
  const defaultOptions = getOptions(useFlatTreeFromILinks());
  const [state, setState] = useState<SelectState>({
    isLoading: false,
    options: defaultOptions,
    value: null,
  });

  const loadNode = useEditorStore((s) => s.loadNode);
  const loadNodeFromId = useEditorStore((s) => s.loadNodeFromId);
  const addILink = useDataStore((s) => s.addILink);

  const styledTheme = useTheme();
  const flattree = useFlatTreeFromILinks();

  const handleChange = (
    newValue: Value | null,
    _actionMeta: ActionMeta<Value> // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    // setState({ ...state, value: newValue });
    if (newValue) {
      const node = getNodeFlatTree(newValue.value, flattree);
      if (node.length > 0) loadNode(node[0]);
    }
    closeModal();
  };

  const handleCreate = (inputValue: string) => {
    setState({ ...state, isLoading: true });
    addILink(inputValue);
    loadNodeFromId(inputValue);
    closeModal();
  };

  const { isLoading, options, value } = state;

  const colors = {
    primary: styledTheme.colors.primary,
    primary75: styledTheme.colors.fade.primary,
    primary50: styledTheme.colors.secondary,
    primary25: styledTheme.colors.fade.primary,
    danger: styledTheme.colors.palette.red,
    dangerLight: '#FFBDAD',

    neutral0: styledTheme.colors.gray.s8,
    neutral5: styledTheme.colors.gray.s8,
    neutral10: styledTheme.colors.gray.s7,
    neutral20: styledTheme.colors.gray.s6,
    neutral30: styledTheme.colors.gray.s5,
    neutral40: styledTheme.colors.gray.s4,
    neutral50: styledTheme.colors.gray.s3,
    neutral60: styledTheme.colors.gray.s2,
    neutral70: styledTheme.colors.gray.s1,
    neutral80: styledTheme.colors.gray.s0,
    neutral90: styledTheme.colors.gray.sw,
  };

  const borderRadius = 4;
  // Used to calculate consistent margin/padding on elements
  const baseUnit = 4;
  // The minimum height of the control
  const controlHeight = 38;
  // The amount of space between the control and menu */
  const menuGutter = baseUnit * 2;

  const spacing = {
    baseUnit,
    controlHeight,
    menuGutter,
  };

  const customTheme: ThemeConfig = {
    borderRadius,
    colors,
    spacing,
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleChange}
      onCreateOption={handleCreate}
      options={options}
      defaultMenuIsOpen
      value={value}
      autoFocus
      theme={customTheme}
    />
  );
};

export default LookupInput;
