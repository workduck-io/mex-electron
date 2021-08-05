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
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0 0 0 ${({ theme }) => theme.spacing.small};
  }
`;

export const InfoTools = styled.div`
  display: flex;
`;

export const StyledEditor = styled('div')`
  max-width: 800px;
  padding: ${({ theme }) => theme.spacing.medium};
  margin: ${({ theme }) => theme.spacing.medium};
  width: 100%;

  font-family: 'Poppins', sans-serif;
  /* font-weight: 400; */
  line-height: 1.75;

  p,
  ol,
  ul,
  .code-block,
  table {
    margin-bottom: 1rem;
  }
  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin-bottom: 0.5rem;
  }

  li,
  ul {
    p {
      margin-bottom: 0;
      padding: 0;
    }
  }

  table {
    p {
      margin: 0.25rem 0;
    }
    th {
      background-color: ${({ theme }) => theme.colors.background.surface};
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 2rem 0 1.3rem;
    line-height: 1.3;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h1 {
    margin-bottom: 1.3rem;
    font-weight: 700;
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

  a {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondary};
  }

  small,
  .text_small {
    font-size: 0.833rem;
  }

  blockquote:before {
    background: ${({ theme }) => theme.colors.gray.s3};
  }
  blockquote {
    :before {
      background: ${({ theme }) => theme.colors.gray.s3}!important;
    }
    p {
      margin: 0.25rem 0;
    }
  }

  p.caption {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  pre,
  pre code {
    font-size: 1rem;
  }
  pre {
    background-color: ${({ theme }) => theme.colors.background.surface};
  }

  // Forms
  button,
  select,
  input[type='submit'],
  input[type='reset'],
  input[type='button'],
  input[type='checkbox'],
  input[type='range'],
  input[type='radio'] {
    cursor: pointer;
  }

  input:not([type='checkbox']):not([type='radio']),
  select {
    display: block;
  }

  input,
  button,
  textarea,
  select {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.input};
    font-family: inherit;
    font-size: inherit;
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 10px;
    border: none;
    border-radius: 6px;
    outline: none;
  }

  input[type='color'] {
    min-height: 2rem;
    padding: 8px;
    cursor: pointer;
  }

  input[type='checkbox'],
  input[type='radio'] {
    height: 1em;
    width: 1em;
  }

  input[type='radio'] {
    border-radius: 100%;
  }

  input {
    vertical-align: top;
  }

  label {
    vertical-align: middle;
    margin-bottom: 4px;
    display: inline-block;
  }

  input:not([type='checkbox']):not([type='radio']),
  input[type='range'],
  select,
  button,
  textarea {
    -webkit-appearance: none;
  }

  textarea {
    display: block;
    margin-right: 0;
    box-sizing: border-box;
    resize: vertical;
  }

  textarea:not([cols]) {
    width: 100%;
  }

  textarea:not([rows]) {
    min-height: 40px;
    height: 140px;
  }

  select {
    background: ${({ theme }) => theme.colors.background.input}
      ${({ theme }) => theme.colors.primary} calc(100% - 12px) 50% / 12px
      no-repeat;
    padding-right: 35px;
  }

  select::-ms-expand {
    display: none;
  }

  select[multiple] {
    padding-right: 10px;
    background-image: none;
    overflow-y: auto;
  }

  button,
  input[type='submit'],
  input[type='reset'],
  input[type='button'] {
    padding-right: 30px;
    padding-left: 30px;
  }

  button:hover,
  input[type='submit']:hover,
  input[type='reset']:hover,
  input[type='button']:hover {
    color: ${({ theme }) => theme.colors.palette.black};
    background: ${({ theme }) => theme.colors.secondary};
  }

  input:focus,
  select:focus,
  button:focus,
  textarea:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }

  input[type='checkbox']:active,
  input[type='radio']:active,
  input[type='submit']:active,
  input[type='reset']:active,
  input[type='button']:active,
  input[type='range']:active,
  button:active {
    transform: translateY(2px);
  }

  input:disabled,
  select:disabled,
  button:disabled,
  textarea:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.text.default};
  }

  fieldset {
    border: 1px ${({ theme }) => theme.colors.primary} solid;
    border-radius: 6px;
    margin: 0;
    margin-bottom: 12px;
    padding: 10px;
  }

  legend {
    font-size: 0.9em;
    font-weight: 600;
  }
`;

const colors = {
  almostBlack: darkTheme.colors.background.surface,
  lightBlack: darkTheme.colors.background.card,
  almostWhite: darkTheme.colors.text.default,
  white: darkTheme.colors.text.primary,
  white10: 'rgba(255, 255, 255, 0.1)',
  black: '#000',
  black10: 'rgba(0, 0, 0, 0.1)',
  primary: darkTheme.colors.primary,
  greyLight: '#F4F7FA',
  grey: '#E8EBED',
  greyMid: '#C5CCD3',
  greyDark: darkTheme.colors.gray.s3,
  transparent: 'rgba(0, 0, 0, 0)',
};

export const base = {
  ...colors,
  fontFamily:
    "'Inter', -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen, Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
  fontFamilyMono:
    "'Iosevka',Consolas,'Liberation Mono', Menlo, Courier,monospace",
  fontWeight: 400,
  zIndex: 100,
  link: colors.primary,
  placeholder: '#B1BECC',
  textSecondary: darkTheme.colors.gray.s3,
  textLight: colors.white,
  textHighlight: '#b3e7ff',
  textHighlightForeground: colors.black,
  selected: colors.primary,
  //
  codeComment: '#464B5D',
  codePunctuation: '#89DDFF',
  codeNumber: '#F78C6C',
  codeProperty: '#B2CCD6',
  codeTag: '#f07178',
  codeString: '#C3E88D',
  codeSelector: '#82AAFF',
  codeAttr: '#FFCB6B',
  codeEntity: '#22a2c9',
  codeKeyword: '#C792EA',
  codeFunction: '#82AAFF',
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
