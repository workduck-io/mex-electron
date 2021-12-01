import styled, { css } from 'styled-components'

// const classNames = {
//   root: 'slate-TagCombobox',
//   tagItem: 'slate-TagCombobox-tagItem',
//   tagItemHighlighted: 'slate-TagCombobox-tagItemHighlighted',
// };

export const ComboboxRoot = styled.ul<{ isOpen: boolean }>`
  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      top: -9999px;
      left: -9999px;
      position: absolute;
      padding: 0;
      margin: 0;
      z-index: 11;
      background: ${theme.colors.background.modal};
      width: 300px;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.133) 0 3.2px 7.2px 0, rgba(0, 0, 0, 0.11) 0 0.6px 1.8px 0;
    `}
`

export const ComboboxItem = styled.div<{ highlighted: boolean }>`
  display: flex;
  align-items: center;
  font-size: 14px;

  :first-child {
    border-radius: 6px 6px 0 0;
  }

  :last-child {
    border-radius: 0 0 6px 6px;
  }

  font-weight: 400;
  padding: 0 8px;
  // padding: 1px 3px;
  // borderRadius: 3px;
  min-height: 36px;
  // lineHeight: "20px";
  // overflowWrap: "break-word";
  user-select: none;
  color: ${({ theme }) => theme.colors.text.subheading};
  background: ${({ highlighted, theme }) => (!highlighted ? 'transparent' : theme.colors.background.highlight)};
  cursor: pointer;

  :hover {
    background-color: ${({ highlighted, theme }) =>
      !highlighted ? theme.colors.background.card : theme.colors.background.highlight};
  }
`
