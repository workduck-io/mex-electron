import { TippyBalloonStyles } from '../../Styled/Toolbar'
import { createGlobalStyle } from 'styled-components'
import normalize from './normalize'

const GlobalStyle = createGlobalStyle`
  ${normalize}

  html {
    height: 100vh;
    overflow: hidden;
  }

  body {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  ${TippyBalloonStyles}

`

export default GlobalStyle
