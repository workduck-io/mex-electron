import { InfoBarWrapper } from '@style/infobar'
import { MainNav, SideNav } from '@style/Nav'
import { transparentize } from 'polished'
import { css } from 'styled-components'

export const MexStyles = css`
  body {
    background-color: #36393E;
    /*background: linear-gradient(-60deg, #17111f, #182033);*/
  }
  ${MainNav}, ${SideNav}, ${InfoBarWrapper} {
    background-color #1E2124;
    }
`
