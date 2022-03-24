import { transparentize } from 'polished'
import { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components'
import { GraphWrapper, StyledGraph } from '../../components/mex/Graph/Graph.styles'
import { TemplateCard } from '../../components/mex/Integrations/Template/styled'
import { ReminderStyled } from '../../components/mex/Reminders/Reminders.style'
import { ComingSoonCard, ImporterCard } from '../../components/mex/Settings/Importers'
import { DataInfobarWrapper } from '../../components/mex/Sidebar/DataInfoBar'
import { NavWrapper } from '../../components/mex/Sidebar/Nav'
import { BalloonToolbarBase } from '../../editor/Components/BalloonToolbar'
import { EditorPreviewWrapper } from '../../editor/Components/EditorPreview/EditorPreview.styles'
import { ComboboxItem, ComboboxRoot } from '../../editor/Components/tag/components/TagCombobox.styles'
import { TodoContainer } from '../../ui/components/Todo.style'
import { ArchivedNode } from '../../views/mex/Archive'
import { SettingsOptions } from '../../views/mex/Settings'
import { BackCard } from '../Card'
import { EditorStyles, NodeInfo, StyledEditor } from '../Editor'
import { GridWrapper } from '../Grid'
import { InfobarTools, InfoBarWrapper } from '../infobar'
import { ServiceCard } from '../Integration'
import { Result } from '../Search'
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
      ${containerStyle}
      margin: 0 0;
    }
    ${InfoBarWrapper} {
      margin-right: 3rem;
      overflow: auto;
    }
    ${GraphWrapper} {
      ${containerStyle}
    }
  `

  const edStyles = css`
    ${EditorStyles} {
      ${props.containerStyle}
    }
    ${StyledEditor} {
      margin: 0 auto;
    }
    ${NodeInfo} {
      ${containerStyle}
    }
    ${DataInfobarWrapper} {
      height: ${heightMain};
      ${containerStyle}
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
  `

  const navStyles = css`
    ${NavWrapper} {
      padding: 0;
      margin: 0;
      overflow: auto;
      height: ${heightMain};
      min-height: ${heightMain};
      ${containerStyle}
    }
    ${GridWrapper} {
      margin: 2rem;
      margin-left: ${({ theme }) => theme.spacing.medium};
      margin-right: -1rem;
      margin-bottom: 0;
      grid-gap: ${({ theme }) => theme.spacing.medium};
    }
  `

  const sidebarStyles = css`
    ${SidebarDiv} {
      height: ${heightMain};
      ${containerStyle}
      margin-top: 0;
      padding: 0 ${({ theme }) => theme.spacing.medium};
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
  ${gridCardStyles}
  ${edStyles}
  ${graphStyles}
  ${todoStyles}
  ${remindersStyles}
  `
  return mainCss
}
