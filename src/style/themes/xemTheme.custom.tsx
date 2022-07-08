import { InfoBarWrapper } from '@style/infobar'
import { MainNav, SideNav } from '@style/Nav'
import { transparentize } from 'polished'
import { css } from 'styled-components'

export const xemThemeStyles = css`
  body {
    background: linear-gradient(-60deg, #17111f, #182033);
  }
  ${MainNav} {
    background: linear-gradient(2.9deg, rgba(38, 46, 66, 0.5) 3.74%, rgba(47, 53, 84, 0.5) 96.25%);
  }

  ${SideNav}, ${InfoBarWrapper} {
    background: rgba(34, 36, 55, 0.5);
  }
`