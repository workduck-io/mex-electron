import { mix } from 'polished'
import styled, { css } from 'styled-components'

export const NoteTitle = styled.h1``

export const NodeInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[9]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  margin: 0 0 3rem;

  ${NoteTitle} {
    color: ${({ theme }) => theme.colors.text.subheading};
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0 0 0 ${({ theme }) => theme.spacing.small};
  }
`

export const InfoTools = styled.div`
  display: flex;
`

interface StyledEditorProps {
  showGraph?: boolean
}

const MediumPaddingMargin = css`
  padding: ${({ theme }) => theme.spacing.medium};
  margin: ${({ theme }) => theme.spacing.medium} auto;
`

export const StyledEditor = styled.div<StyledEditorProps>`
  ${MediumPaddingMargin}
  width: 100%;
  max-width: 1000px;
  min-width: 400px;
  /* ${({ showGraph }) =>
    showGraph
      ? css`
          max-width: 600px;
        `
      : css`
          max-width: 800px;
        `} */
`

export const EditorStyles = styled.div`
  font-family: 'Inter', sans-serif;
  /* font-weight: 400; */
  line-height: 1.75;

  color: ${({ theme }) => theme.colors.text.default};

  b,
  strong {
    color: ${({ theme }) => theme.colors.text.heading};
  }

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
      border: 1px solid ${({ theme }) => theme.colors.gray[8]};
      background-color: ${({ theme }) => theme.colors.gray[9]};
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
    }
    td {
      background-color: ${({ theme }) => theme.colors.gray[9]};
      border: 1px solid ${({ theme }) => theme.colors.gray[8]};
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
    color: ${({ theme }) => theme.colors.text.heading};
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
    color: ${({ theme }) => theme.colors.primary};
  }

  small,
  .text_small {
    font-size: 0.833rem;
  }

  blockquote {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.default};
    background: ${({ theme }) => theme.colors.gray[8]};
  }
  blockquote {
    :before {
      background: ${({ theme }) => theme.colors.gray[3]} !important;
    }
    p {
      margin: 0.25rem 0;
    }
  }

  p.caption {
    color: ${({ theme }) => theme.colors.text.subheading};
  }

  pre,
  pre code {
    font-family: 'JetBrains Mono', monospace;
    color: ${({ theme }) => mix(0.2, theme.colors.primary, theme.colors.gray[3])};
    font-size: 1rem;
  }
  pre {
    background-color: ${({ theme }) => theme.colors.gray[9]};
  }

  pre,
  pre code,
  code,
  blockquote {
    border-radius: ${({ theme }) => theme.borderRadius.small};
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
    font-family: inherit;
    font-size: inherit;
    padding: 10px;
    border: none;
    outline: none;
  }

  input,
  textarea {
    color: ${({ theme }) => theme.colors.form.input.fg};
    background-color: ${({ theme }) => theme.colors.form.input.bg};
  }

  button,
  select,
  input[type='button'] {
    color: ${({ theme }) => theme.colors.form.button.fg};
    background-color: ${({ theme }) => theme.colors.form.button.bg};

    &:hover {
      background-color: ${({ theme }) => theme.colors.form.button.hover};
    }
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
    background: ${({ theme }) => theme.colors.form.input.bg} ${({ theme }) => theme.colors.primary} calc(100% - 12px)
      50% / 12px no-repeat;
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
    color: ${({ theme }) => theme.colors.text.fade};
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

  input[type='text'],
  textarea {
    border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  }
`
