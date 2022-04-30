import { ThinScrollbar } from '../helpers'
import { TippyBalloonStyles } from '../Toolbar'
import { createGlobalStyle } from 'styled-components'
import normalize from './normalize'
import { transparentize } from 'polished'

const GlobalStyle = createGlobalStyle`
  ${normalize}

  html {
    height: 100vh;
    overflow: hidden;
  }

  #spotlight {
    height: 100%;
    overflow: hidden;
  }

  body {
    height: 100%;
    background-color: ${({ theme }) => transparentize(0.35, theme.colors.background.card)};
    font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  ${TippyBalloonStyles}
  
  * {
      /* box-sizing: border-box; */
      ${ThinScrollbar}
      
      ::-webkit-scrollbar {
        width: 0;
      }
    }
`

export default GlobalStyle
