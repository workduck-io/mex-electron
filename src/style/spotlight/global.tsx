import { ThinScrollbar } from '../helpers'
import { TippyBalloonStyles } from '../Toolbar'
import { createGlobalStyle, css } from 'styled-components'
import normalize from './normalize'
import { transparentize } from 'polished'

export const MainFont = css`
  font-size: 14px;
`

export const BodyFont = css`
  font-size: 12px;
`

const GlobalStyle = createGlobalStyle`
  ${normalize}

  html, body {
    ${MainFont};
    overflow: hidden;
    height: 100vh;
    background-color: ${({ theme }) => transparentize(0.35, theme.colors.background.card)};
    font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  #spotlight {
    height: 100%;
    overflow: hidden;
  }

  ${TippyBalloonStyles}
  
  * {
      ${ThinScrollbar};

      &::-webkit-scrollbar {
        width: 0;
      }
    }
`

export default GlobalStyle
