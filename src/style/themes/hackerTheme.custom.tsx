import { transparentize } from 'polished'
import { Link, NavWrapper } from '../../components/mex/Sidebar/Nav'
import { css } from 'styled-components'
import { SidebarDiv } from '../Sidebar'
import { GridWrapper } from '../Grid'
import { NavButton } from '../Nav'
import { EditorStyles, NodeInfo } from '../Editor'
import { Widget } from '../../editor/Components/SyncBlock'
import { AsyncButton, Button } from '../Buttons'
import { DataInfobarWrapper } from '../../components/mex/Sidebar/DataInfoBar'
import { StyledGraph, GraphTools, GraphWrapper } from '../../components/mex/Graph/Graph.styles'
import { InfoBarWrapper } from '../../components/layouts/InfoBar'
import { EditorPreviewWrapper } from '../../editor/Components/EditorPreview/EditorPreview.styles'
import { SettingsOptions, SettingTitle } from '../../views/mex/Settings'
import { BackCard } from '../Card'
import { ComingSoonCard, ImporterCard } from '../../components/mex/Settings/Importers'
import { RightCut, ServiceCard } from '../Integration'
import { TemplateCard } from '../../components/mex/Integrations/Template/styled'
import { ArchivedNode } from '../../views/mex/Archive'
import { Result, ResultHeader, SearchContainer } from '../Search'
import { CreateSnippet, SSnippet } from '../Snippets'
import { ComboboxRoot, ComboboxItem } from '../../editor/Components/tag/components/TagCombobox.styles'
import { ActionDraggableIcon } from '../../editor/Actions/withDraggable'

const grayMixerTrans = (n: number) => css`
  ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
`
const grayMainColor = css`
  ${grayMixerTrans(10)}
`

const hackerBorder = css`
  border: 2px solid ${({ theme }) => theme.colors.primary};
`

const hackerBorderThin = css`
  border: 1px solid ${({ theme }) => theme.colors.primary};
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
    backdrop-filter: blur(10px);
    margin: 2rem 0 0;
    ${hackerBorder};
  }
  ${InfoBarWrapper} {
    margin-right: 3rem;
    overflow: hidden;
  }
  ${GraphWrapper} {
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    ${hackerBorder};
  }
`

const edStyles = css`
  ${EditorStyles} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
  }
  ${NodeInfo} {
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    ${Button}, ${AsyncButton} {
      ${hackerBorderThin}
      background-color: ${grayMixerTrans(9)};
      color: ${({ theme }) => theme.colors.primary};
      backdrop-filter: blur(10px);
    }
  }
  ${Widget} {
    ${hackerBorderThin}
    background-color: ${grayMixerTrans(8)};
  }
  ${DataInfobarWrapper} {
    height: ${heightMain};
    ${hackerBorder};
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin-top: 2rem;
  }
  ${EditorPreviewWrapper} {
    ${hackerBorder};
    backdrop-filter: blur(10px);
    background: ${grayMainColor} !important;
    ${EditorStyles} {
      background: transparent;
    }
  }
  ${ComboboxRoot} {
    backdrop-filter: blur(10px);
    ${hackerBorder};
    background: ${grayMixerTrans(9)};
  }
  ${ComboboxItem} {
    & > svg {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  ${ActionDraggableIcon} {
    ${hackerBorder};
    background-color: ${grayMixerTrans(9)};
  }
`

const settingsStyles = css`
  ${SettingsOptions} {
    padding: ${({ theme }) => theme.spacing.medium};
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    ${hackerBorder};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${SettingTitle} {
    border: 2px solid transparent;
    &:hover {
      ${hackerBorder};
      background-color: ${grayMixerTrans(8)};
    }
  }
  ${BackCard}, ${ComingSoonCard}, ${ImporterCard} {
    border: none;
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const gridCardStyles = css`
  ${ArchivedNode}, ${Result} {
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    overflow: hidden;
  }
  ${ResultHeader} {
    ${hackerBorder};
    background-color: ${grayMixerTrans(9)};
  }
  ${SSnippet} {
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
  }
  ${CreateSnippet} {
    ${hackerBorder};
    background-color: ${grayMixerTrans(8)};
    backdrop-filter: blur(10px);
  }
  ${SearchContainer} {
    margin-right: 3rem;
  }
`

const integrationStyles = css`
  ${TemplateCard}, ${ServiceCard} {
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    &:hover {
      border: 0.2rem solid ${({ theme }) => theme.colors.primary};
    }

    ${RightCut} {
      border-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.primary} transparent
        transparent;
    }
  }
`

const navStyles = css`
  ${SidebarDiv} {
    height: ${heightMain};
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: 0 ${({ theme }) => theme.spacing.medium};
    .rc-tree .rc-tree-treenode span.rc-tree-switcher {
      color: ${({ theme }) => theme.colors.primary};
    }
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
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
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
  ${Link} {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const HackerFonts = css`
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Space+Mono:wght@700&display=swap');

  ${EditorStyles}, body {
    font-family: 'Fira Code', monospace;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Space Mono', monospace;
  }
`

const GlobalHackerStyles = css`
  .ModalContent {
    ${hackerBorder};
    background-color: ${grayMainColor};
    border: none;
  }
  .ModalOverlay {
    backdrop-filter: blur(10px);
  }
  button {
    ${hackerBorderThin}
  }
`
export const HackerStyles = css`
  ${GlobalHackerStyles}
  ${HackerFonts}
  ${navStyles}
  ${settingsStyles}
    ${integrationStyles}
    ${gridCardStyles}
    ${edStyles}
  ${graphStyles}
`
