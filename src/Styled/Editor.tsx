import styled from 'styled-components';
import { darkTheme } from './themes';

export const NoteTitle = styled.h1``;

export const NodeInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.background.surface};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius.large};

  margin: 0 0 3rem;

  ${NoteTitle} {
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0;
  }
`;

export const InfoTools = styled.div`
  display: flex;
`;

export const StyledEditor = styled('div')`
  /* width: 100%; */
  padding: ${({ theme }) => theme.spacing.medium};
  margin: ${({ theme }) => theme.spacing.medium};

  font-family: 'Poppins', sans-serif;
  /* font-weight: 400; */
  line-height: 1.75;

  p {
    margin-bottom: 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 3rem 0 1.38rem;
    line-height: 1.3;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h1 {
    margin-top: 0;
    font-size: 2.488rem;
  }

  h2 {
    font-size: 2.074rem;
  }

  h3 {
    font-size: 1.728rem;
  }

  h4 {
    font-size: 1.44rem;
  }

  h5 {
    font-size: 1.2rem;
  }

  small,
  .text_small {
    font-size: 0.833rem;
  }
`;

const colors = {
  almostBlack: darkTheme.colors.background.surface,
  lightBlack: darkTheme.colors.gray.gray,
  almostWhite: darkTheme.colors.text.default,
  white: darkTheme.colors.text.primary,
  white10: 'rgba(255, 255, 255, 0.1)',
  black: '#000',
  black10: 'rgba(0, 0, 0, 0.1)',
  primary: darkTheme.colors.primary,
  greyLight: '#F4F7FA',
  grey: '#E8EBED',
  greyMid: '#C5CCD3',
  greyDark: '#DAE1E9',
  transparent: 'rgba(0, 0, 0, 0)',
};

export const base = {
  ...colors,
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen, Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
  fontFamilyMono:
    "'SFMono-Regular',Consolas,'Liberation Mono', Menlo, Courier,monospace",
  fontWeight: 400,
  zIndex: 100,
  link: colors.primary,
  placeholder: '#B1BECC',
  textSecondary: '#4E5C6E',
  textLight: colors.white,
  textHighlight: '#b3e7ff',
  textHighlightForeground: colors.black,
  selected: colors.primary,
  codeComment: '#6a737d',
  codePunctuation: '#5e6687',
  codeNumber: '#d73a49',
  codeProperty: '#c08b30',
  codeTag: '#3d8fd1',
  codeString: '#032f62',
  codeSelector: '#6679cc',
  codeAttr: '#c76b29',
  codeEntity: '#22a2c9',
  codeKeyword: '#d73a49',
  codeFunction: '#6f42c1',
  codeStatement: '#22a2c9',
  codePlaceholder: '#3d8fd1',
  codeInserted: '#202746',
  codeImportant: '#c94922',

  blockToolbarBackground: colors.white,
  blockToolbarTrigger: colors.greyMid,
  blockToolbarTriggerIcon: colors.white,
  blockToolbarItem: colors.almostBlack,
  blockToolbarIcon: undefined,
  blockToolbarIconSelected: colors.black,
  blockToolbarText: colors.almostBlack,
  blockToolbarTextSelected: colors.black,
  blockToolbarHoverBackground: colors.greyLight,
  blockToolbarDivider: colors.greyMid,

  noticeInfoBackground: '#F5BE31',
  noticeInfoText: colors.almostBlack,
  noticeTipBackground: '#9E5CF7',
  noticeTipText: colors.white,
  noticeWarningBackground: '#FF5C80',
  noticeWarningText: colors.white,
};

export const light = {
  ...base,
  background: colors.white,
  text: colors.almostBlack,
  code: colors.lightBlack,
  cursor: colors.black,
  divider: colors.greyMid,

  toolbarBackground: colors.lightBlack,
  toolbarHoverBackground: colors.black,
  toolbarInput: colors.white10,
  toolbarItem: colors.white,

  tableDivider: colors.greyMid,
  tableSelected: colors.primary,
  tableSelectedBackground: '#E5F7FF',

  quote: colors.greyDark,
  codeBackground: colors.greyLight,
  codeBorder: colors.grey,
  horizontalRule: colors.greyMid,
  imageErrorBackground: colors.greyLight,

  scrollbarBackground: colors.greyLight,
  scrollbarThumb: colors.greyMid,
};

export const dark = {
  ...base,
  background: colors.transparent,
  text: colors.almostWhite,
  code: colors.almostWhite,
  cursor: colors.primary,
  divider: '#4E5C6E',
  placeholder: '#52657A',

  toolbarBackground: colors.white,
  toolbarHoverBackground: colors.greyMid,
  toolbarInput: colors.black10,
  toolbarItem: colors.lightBlack,

  tableDivider: colors.lightBlack,
  tableSelected: colors.primary,
  tableSelectedBackground: '#002333',

  quote: colors.greyDark,
  codeBackground: colors.almostBlack,
  codeBorder: colors.lightBlack,
  codeString: '#3d8fd1',
  horizontalRule: colors.lightBlack,
  imageErrorBackground: 'rgba(0, 0, 0, 0.5)',

  scrollbarBackground: colors.black,
  scrollbarThumb: colors.lightBlack,
};
