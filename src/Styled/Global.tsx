import { createGlobalStyle, css } from 'styled-components'
import { ThinScrollbar } from './helpers'
import normalize from './normalize'
import { ModalStyles } from '../Components/Refactor/styles'
import { TippyBalloonStyles } from './Toolbar'

const GlobalStyle = createGlobalStyle`
  ${normalize}; // NormalizeCSS normalization

  input:focus-visible {
    outline: ${({ theme }) => theme.colors.primary} solid 1px;
  }

  * {
    box-sizing: border-box;
  }

  body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    font-family: Inter, sans-serif;
    color: ${({ theme }) => theme.colors.text.heading};
    ${({ theme }) => {
      if (theme.backgroundImages) {
        return css`
          background-color: ${({ theme }) => theme.colors.background.app};
          background-image: url(${theme.backgroundImages.app});
          background-size: cover;
        `
      }

      return css`
        background: ${({ theme }) => theme.colors.background.app};
      `
    }}
    
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
  ${ModalStyles}

  /* Tippy Balloon styles */
  ${TippyBalloonStyles}

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
