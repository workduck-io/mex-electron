import { InfoBarWrapper } from '@style/infobar'
import { MainNav, SideNav } from '@style/Nav'
import { SplitSearchPreviewWrapper } from '@style/Search'
import { StyledBoard } from '@style/Todo'
import { getTippyStyles } from '@style/Toolbar'
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
  ${StyledBoard} {
    .react-kanban-column {
      background-color: ${transparentize(0.1, '#1E2124')};
    }
  }

  ${SplitSearchPreviewWrapper} {
    background-color: ${transparentize(0.1, '#1E2124')};
  }

  ${({ theme }) => getTippyStyles('mex', theme.colors.text.fade, theme.colors.gray[9])}
`
