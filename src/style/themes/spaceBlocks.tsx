import { ServiceContainer } from '@components/mex/Integrations/styled'
import { TrafficLightBG } from '@components/mex/Sidebar/logo'
import { transparentize } from 'polished'
import { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components'
import { GraphWrapper, StyledGraph } from '../../components/mex/Graph/Graph.styles'
import { TemplateCard } from '../../components/mex/Integrations/Template/styled'
import { ReminderStyled } from '../../components/mex/Reminders/Reminders.style'
import { ComingSoonCard, ImporterCard } from '../../components/mex/Settings/Importers'
import { DataInfobarWrapper } from '../../components/mex/Sidebar/DataInfoBar'
import { BalloonToolbarBase } from '../../editor/Components/BalloonToolbar'
import { EditorPreviewWrapper } from '../../editor/Components/EditorPreview/EditorPreview.styles'
import { ComboboxItem, ComboboxRoot } from '../../editor/Components/tag/components/TagCombobox.styles'
import { TodoContainer } from '../../ui/components/Todo.style'
import { ArchivedNode } from '../../views/mex/Archive'
import { SettingsOptions } from '../../views/mex/Settings'
import { SwitchWrapper } from '../../views/router/Switch'
import { BackCard } from '../Card'
import { CenteredMainContent, EditorStyles, EditorWrapper, NodeInfo, StyledEditor } from '../Editor'
import { GridWrapper } from '../Grid'
import { InfobarTools, InfoBarWrapper } from '../infobar'
import { ServiceCard } from '../Integration'
import { NavWrapper, RHSideNav, SideNav } from '../Nav'
import { Result, SearchFilterListWrap } from '../Search'
import { SidebarDiv } from '../Sidebar'
import { CreateSnippet, SSnippet } from '../Snippets'
import { StyledBoard } from '../Todo'

interface SpaceProps {
  containerStyle?: FlattenInterpolation<ThemeProps<DefaultTheme>>
  containerStyleReset?: FlattenInterpolation<ThemeProps<DefaultTheme>>
  heightMain?: string
  blur?: string
}

export const SpaceBlocksCss = (props: SpaceProps) => {
  const { containerStyleReset, heightMain, blur } = props
  const grayMixerTrans = (n: number) => css`
    ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
  `

  const containerStyle = css`
    ${props.containerStyle};
    ${blur &&
    css`
      backdrop-filter: blur(${blur});
    `}
  `

  // const NeoContainer = css`
  //   background-color: ${palette.body};
  //   box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
  // `

  const graphStyles = css`
    ${StyledGraph} {
      height: ${heightMain};
      display: flex;
      flex-direction: column;
      gap: ${({ theme }) => theme.spacing.medium};
    }
    ${InfobarTools} {
      margin: 0 0;
    }
    ${InfoBarWrapper} {
      overflow: auto;
    }
    ${GraphWrapper} {
    }
  `

  const edStyles = css`
    ${CenteredMainContent} {
      height: calc(100vh - 4rem);
      margin: 0 auto;
      height: calc(100vh - 4rem);
      padding-top: 1rem;
    }
    ${StyledEditor} {
      ${containerStyle}
    }
    ${DataInfobarWrapper} {
      margin-top: 0rem;
      margin-top: 0;
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
        ${containerStyleReset}
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
        ${containerStyleReset}
      }
    }
    ${StyledBoard} {
      .react-kanban-column {
        ${containerStyle}
      }
    }
  `

  const settingsStyles = css`
    ${SettingsOptions} {
      padding: ${({ theme }) => theme.spacing.medium};
      ${containerStyle}
    }
    ${BackCard}, ${ComingSoonCard}, ${ImporterCard} {
      ${containerStyle}
    }
    // ${SwitchWrapper} {
    // }
  `

  const gridCardStyles = css`
    ${ArchivedNode}, ${Result} {
      ${containerStyle}
      overflow: hidden;
    }
    ${SSnippet} {
      ${containerStyle}
    }
    ${CreateSnippet} {
      ${containerStyle}
    }
  `

  const integrationStyles = css`
    ${TemplateCard}, ${ServiceCard} {
      ${containerStyle}
    }
    ${ServiceContainer} {
      ${containerStyleReset}
    }
  `

  const navStyles = css`
    ${TrafficLightBG} {
      background-color: transparent;
    }
    ${NavWrapper} {
      ${containerStyle}
      margin: 0;
      height: ${heightMain};
      min-height: ${heightMain};
    }
    ${SideNav} {
      padding: 0;
      border-radius: ${({ theme }) => theme.borderRadius.small};
      height: ${heightMain};
      min-height: ${heightMain};
    }
    ${RHSideNav} {
      ${containerStyle}
      padding: 0;
      border-radius: ${({ theme }) => theme.borderRadius.small};
      height: ${heightMain};
      min-height: ${heightMain};
    }
    ${GridWrapper} {
      width: 100vw;
      padding: 2rem 1rem;
      grid-gap: ${({ theme }) => theme.spacing.medium};
    }
  `

  const searchStyles = css`
    ${SearchFilterListWrap} {
      width: -webkit-fill-available;
    }
  `

  const sidebarStyles = css`
    ${SidebarDiv} {
      height: ${heightMain};
      ${containerStyle}
      margin-top: 0;
      padding: 0;
    }
  `

  const remindersStyles = css`
    ${ReminderStyled} {
      ${containerStyle}
    }
  `

  const modalStyles = css`
    .ModalContent {
      ${containerStyle}
    }
  `
  const mainCss = css`
    ${modalStyles}
    ${navStyles}
  ${sidebarStyles}
  ${settingsStyles}
  ${integrationStyles}
  ${searchStyles}
  ${gridCardStyles}
  ${edStyles}
  ${graphStyles}
  ${todoStyles}
  ${remindersStyles}
  `
  return mainCss
}
