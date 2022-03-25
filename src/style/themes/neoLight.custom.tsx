import { mix, transparentize } from 'polished'
import { NavWrapper } from '../../components/mex/Sidebar/Nav'
import { css } from 'styled-components'
import { SidebarDiv, StyledTree } from '../Sidebar'
import { GridWrapper } from '../Grid'
import { NavButton } from '../Nav'
import { EditorStyles, NodeInfo, StyledEditor } from '../Editor'
import { Widget } from '../../editor/Components/SyncBlock'
import { AsyncButton, Button } from '../Buttons'
import { DataInfobarWrapper } from '../../components/mex/Sidebar/DataInfoBar'
import { StyledGraph, GraphWrapper } from '../../components/mex/Graph/Graph.styles'
import { EditorPreviewWrapper } from '../../editor/Components/EditorPreview/EditorPreview.styles'
import { SettingsOptions, SettingTitle } from '../../views/mex/Settings'
import { BackCard } from '../Card'
import { ComingSoonCard, ImporterCard } from '../../components/mex/Settings/Importers'
import { MenuTrigger, RightCut, ServiceCard, Title } from '../Integration'
import { ServiceChip, TemplateCard, TemplateCommand } from '../../components/mex/Integrations/Template/styled'
import { ArchivedNode } from '../../views/mex/Archive'
import { Result, ResultHeader, SearchContainer, SplitSearchPreviewWrapper } from '../Search'
import { CreateSnippet, SSnippet } from '../Snippets'
import { ComboboxRoot, ComboboxItem } from '../../editor/Components/tag/components/TagCombobox.styles'
import { SwitchWrapper } from '../../views/router/Switch'
import { BalloonToolbarBase } from '../../editor/Components/BalloonToolbar'
import { StyledMenu } from '../../components/mex/NodeSelect/NodeSelect.styles'
import { SILink } from '../../editor/Components/ilink/components/ILinkElement.styles'
import { InfobarTools, InfoBarWrapper } from '../infobar'
import { SpaceBlocksCss } from './spaceBlocks'
import { TodoContainer } from '../../ui/components/Todo.style'

const palette = { body: '#C4CCE0', background: '#D2D9EC', shadow: '#576BA4', primDark: '#4263B6' }
const grayMixerTrans = (n: number) => css`
  ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
`
const grayMainColor = palette.background

const heightMain = `calc(100vh - 3rem)`

const graphStyles = css`
  ${StyledGraph} {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.medium};
  }
  ${InfoBarWrapper} {
    overflow: auto;
  }
  ${GraphWrapper} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const edStyles = css`
  ${MenuTrigger} {
    background-color: ${({ theme }) => theme.colors.gray[10]};
  }
  ${EditorStyles} {
    border-radius: 1rem;
    transition: all 0.25s ease-in-out;
    blockquote {
      background-color: ${({ theme }) => theme.colors.gray[9]};
    }
  }
  ${SILink} {
    .ILink_decoration {
      color: ${({ theme }) => theme.colors.primary};
      &_left {
      }
      &_right {
        margin-left: ${({ theme }) => theme.spacing.tiny};
      }
      &_value {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
  ${Widget} {
    background-color: ${grayMixerTrans(9)};
  }
  ${DataInfobarWrapper} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${BalloonToolbarBase} {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    box-shadow: 0px 10px 20px ${({ theme }) => transparentize(0.75, theme.colors.palette.black)};
    .slate-ToolbarButton-active,
    .slate-ToolbarButton:hover {
      color: ${({ theme }) => theme.colors.secondary};
      background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
    }
  }
  ${EditorPreviewWrapper} {
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

const todoStyles = css`
  ${TodoContainer} {
    ${EditorStyles} {
      padding: 0;
    }
  }
`

const settingsStyles = css`
  ${SettingsOptions} {
    padding: ${({ theme }) => theme.spacing.medium};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${SettingTitle} {
    &:hover {
      background-color: ${grayMixerTrans(8)};
    }
  }
  ${BackCard}, ${ComingSoonCard}, ${ImporterCard} {
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const gridCardStyles = css`
  ${ArchivedNode}, ${Result} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    overflow: hidden;
  }
  ${ResultHeader} {
    background-color: ${grayMixerTrans(9)};
  }
  ${CreateSnippet} {
    background-color: ${grayMixerTrans(10)};
  }
`

const searchStyles = css`
  ${SearchContainer} {
    margin-right: 3rem;
  }
  ${SplitSearchPreviewWrapper} {
    ${Title} {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const integrationStyles = css`
  ${TemplateCard}, ${ServiceCard} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    &:hover {
      border: 0.2rem solid ${({ theme }) => theme.colors.primary};
    }

    ${RightCut} {
      border-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.primary} transparent
        transparent;
    }
  }
  ${ServiceChip} {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray[9]};
    box-shadow: none;
  }
`

const navStyles = css`
  ${NavWrapper} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${NavButton} {
    margin-top: 0;
  }
`

const sidebarStyles = css`
  ${SidebarDiv} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    ${StyledTree} {
      ${({ theme }) => css`
        .rc-tree .rc-tree-treenode {
          .rc-tree-node-selected {
            background-color: ${theme.colors.primary};
            .rc-tree-title {
              color: ${theme.colors.text.oppositePrimary} !important;
            }
            box-shadow: 0px 2px 6px ${theme.colors.primary};
          }

          span.rc-tree-switcher {
            color: ${theme.colors.primary};
            :hover {
              color: ${theme.colors.primary};
            }
          }
        }
      `}
    }
  }
`

const modalStyles = css`
  .ModalContent {
    border: none;
  }
  .ModalOverlay {
  }

  ${StyledMenu} {
    box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.5, theme.colors.palette.black)};
    background-color: ${({ theme }) => theme.colors.gray[9]};
  }
`

const containerStyle = css`
  background-color: ${palette.background};
  box-shadow: 0px 15px 40px ${transparentize(0.9, palette.shadow)};
`

const containerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
`

const spaceBlocks = SpaceBlocksCss({ containerStyle, containerStyleReset, heightMain })

export const NeoLightStyles = css`
  body {
    background-color: ${palette.body};
  }
  ${searchStyles}
  ${todoStyles}
  ${spaceBlocks}
  ${modalStyles}
  ${navStyles}
  ${sidebarStyles}
  ${settingsStyles}
    ${integrationStyles}
    ${gridCardStyles}
    ${edStyles}
  ${graphStyles}
`
