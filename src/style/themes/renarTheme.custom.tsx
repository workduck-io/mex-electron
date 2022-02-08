import { transparentize } from 'polished'
import { NavWrapper } from '../../components/mex/Sidebar/Nav'
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
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    margin: 2rem 0 0;
  }
  ${InfoBarWrapper} {
    margin-right: 3rem;
    overflow: hidden;
  }
  ${GraphWrapper} {
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const edStyles = css`
  ${EditorStyles} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
  }
  ${NodeInfo} {
    backdrop-filter: blur(10px);
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
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin-top: 2rem;
  }
  ${EditorPreviewWrapper} {
    backdrop-filter: blur(10px);
    background: ${grayMainColor} !important;
    ${EditorStyles} {
      background: transparent;
    }
  }
  ${ComboboxRoot} {
    backdrop-filter: blur(10px);
    background: ${grayMixerTrans(9)};
  }
  ${ComboboxItem} {
    & > svg {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`

const settingsStyles = css`
  ${SettingsOptions} {
    padding: ${({ theme }) => theme.spacing.medium};
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${SettingTitle} {
    &:hover {
      background-color: ${grayMixerTrans(8)};
    }
  }
  ${BackCard}, ${ComingSoonCard}, ${ImporterCard} {
    border: none;
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const gridCardStyles = css`
  ${ArchivedNode}, ${Result} {
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    overflow: hidden;
  }
  ${ResultHeader} {
    backdrop-filter: blur(10px);
    background-color: ${grayMixerTrans(9)};
  }
  ${SSnippet} {
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
  }
  ${CreateSnippet} {
    backdrop-filter: blur(10px);
    background-color: ${grayMixerTrans(8)};
  }
  ${SearchContainer} {
    margin-right: 3rem;
  }
`

const integrationStyles = css`
  ${TemplateCard}, ${ServiceCard} {
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
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
    backdrop-filter: blur(10px);
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
    backdrop-filter: blur(10px);
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

export const RenarStyles = css`
  .ModalContent {
    background-color: ${grayMainColor};
    border: none;
  }
  .ModalOverlay {
    backdrop-filter: blur(10px);
  }
  ${navStyles}
  ${settingsStyles}
    ${integrationStyles}
    ${gridCardStyles}
    ${edStyles}
  ${graphStyles}
`
