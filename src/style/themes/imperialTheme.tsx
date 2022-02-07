import { transparentize } from 'polished'
import { NavWrapper } from '../../components/mex/Sidebar/Nav'
import { css } from 'styled-components'
import { SidebarDiv } from '../Sidebar'
import { generateTheme } from '../themeGenerator'
import { GridWrapper } from '../Grid'
import { NavButton } from '../Nav'
import { EditorStyles, NodeInfo } from '../Editor'
import { Widget } from '../../editor/Components/SyncBlock'
import { AsyncButton, Button } from '../Buttons'
import { DataInfobarWrapper } from '../../components/mex/Sidebar/DataInfoBar'
import { StyledGraph, GraphTools, GraphWrapper } from '../../components/mex/Graph/Graph.styles'
import { InfoBarWrapper } from '../../components/layouts/InfoBar'
import { EditorPreviewWrapper } from '../../editor/Components/EditorPreview/EditorPreview.styles'

const grayMixerTrans = (n: number) => css`
  ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
`
const grayMainColor = css`
  ${grayMixerTrans(10)}
`

const heightMain = css`
  calc(100vh - 4rem)
`

const graphStyles = css`
  ${StyledGraph} {
    height: ${heightMain};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.medium};
  }
  ${GraphTools} {
    background-color: ${grayMainColor};
    margin: 0;
  }
  ${InfoBarWrapper} {
    margin-right: 3rem;
    overflow: hidden;
  }
  ${GraphWrapper} {
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const edStyles = css`
  ${EditorStyles} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    background-color: ${grayMainColor};
  }
  ${NodeInfo} {
    background-color: ${grayMainColor};
    ${Button}, ${AsyncButton} {
      background-color: ${grayMixerTrans(9)};
    }
  }
  ${Widget} {
    background-color: ${grayMixerTrans(8)};
  }
  ${DataInfobarWrapper} {
    height: ${heightMain};
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const navStyles = css`
  ${SidebarDiv} {
    height: ${heightMain};
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: 0 ${({ theme }) => theme.spacing.medium};
    .rc-tree .rc-tree-treenode .rc-tree-node-selected {
      background-color: ${({ theme }) => theme.colors.primary};
      .rc-tree-title {
        color: ${({ theme }) => theme.colors.text.oppositePrimary} !important;
      }
      box-shadow: 0px 2px 6px ${({ theme }) => theme.colors.primary};
    }
  }
  ${NavWrapper} {
    padding: 0;
    margin: 2rem 0;
    overflow: auto;
    height: ${heightMain};
    min-height: ${heightMain};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    background-color: ${grayMainColor};
  }
  ${GridWrapper} {
    margin: 1rem;
    height: calc(100vh - 2rem);
    width: calc(100vw - 2rem);
    grid-gap: ${({ theme }) => theme.spacing.medium};
  }
  ${NavButton} {
    margin-top: 0;
  }
`
const customStyles = css`
  .ModalContent {
    background-color: ${grayMainColor};
    border: none;
  }
  .ModalOverlay {
    backdrop-filter: blur(10px);
  }
  ${navStyles}
  ${edStyles}
  ${graphStyles}
`

export const imperialTheme = generateTheme({
  // Colors
  primary: '#c31575',
  secondary: '#748EFF',

  // Palettes
  gray: {
    10: '#0f111a', // Darkest
    9: '#212537',
    8: '#323954',
    7: '#5e6480',
    6: '#8289a8',
    5: '#858db5',
    4: '#9ca3c4',
    3: '#b3b7d3',
    2: '#dcdfef',
    1: '#e9ebf8' // Lightest
  },

  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#ffffff',
    default: '#b0b8db',
    subheading: '#D0D4E7',
    fade: '#b3b7d3',
    disabled: '#9CA2BA',
    accent: '#BCC7FF',
    oppositePrimary: '#ffffff'
  },
  backgroundImages: {
    app: 'https://i.imgur.com/Z2iNoSC.jpg'
  },
  custom: customStyles
})
