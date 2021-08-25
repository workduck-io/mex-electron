import { createGlobalStyle } from 'styled-components'
import { ThinScrollbar } from './helpers'
import { LookupStyles } from '../Components/Lookup'
import normalize from './normalize'
import { RefactorStyles } from '../Components/Refactor/Refactor'

const GlobalStyle = createGlobalStyle`
  ${normalize}; // NormalizeCSS normalization


  body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    font-family: Inter, sans-serif;
    color: ${({ theme }) => theme.colors.text.heading};
    background: ${({ theme }) => theme.colors.background.app};
    
    * {
      ${ThinScrollbar};
    }
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.colors.primary};
    }
  }

  #root {
    width: 100%;
  }
  
  /* Styles for modals */
  ${LookupStyles}

  ${RefactorStyles}


  body > ul[role="listbox"]{
    display: block;
    /* list-style-type: disc; */
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
  }

  button {
    background-color: ${({ theme }) => theme.colors.gray[7]};
    color: ${({ theme }) => theme.colors.gray[3]};
    border: none;
    &:hover, &:active {
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.gray[6]};
    }
  }
`

export default GlobalStyle
