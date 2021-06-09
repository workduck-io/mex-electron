import CreatableSelect from 'react-select/creatable';
import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { ThemeConfig } from 'react-select/src/theme';
import { ActionMeta } from 'react-select';

const createOption = (label: string) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
  createOption('pro'),
  createOption('pro.git'),
  createOption('pro.okayish'),
];

type Value = {
  label: string;
  value: string;
};

interface SelectState {
  isLoading: boolean;
  options: { label: string; value: string }[];
  value: Value | null;
}

const LookupInput: React.FC = () => {
  const [state, setState] = useState<SelectState>({
    isLoading: false,
    options: defaultOptions,
    value: null,
  });

  const styledTheme = useTheme();
  const handleChange = (
    newValue: Value | null,
    _actionMeta: ActionMeta<Value> // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    // console.group('Value Changed');
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
    setState({ ...state, value: newValue });
  };

  const handleCreate = (inputValue: string) => {
    setState({ ...state, isLoading: true });
    // console.group('Option created');
    // console.log('Wait a moment...');
    setTimeout(() => {
      const { options } = state;
      const newOption = createOption(inputValue);
      // console.log(newOption);
      // console.groupEnd();
      setState({
        ...state,
        isLoading: false,
        options: [...options, newOption],
        value: newOption,
      });
    }, 1000);
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
