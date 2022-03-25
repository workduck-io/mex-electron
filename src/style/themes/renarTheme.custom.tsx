import { transparentize } from 'polished'
import { css } from 'styled-components'
import { GraphWrapper, StyledGraph } from '../../components/mex/Graph/Graph.styles'
import { ServiceChip, TemplateCard } from '../../components/mex/Integrations/Template/styled'
import { StyledMenu } from '../../components/mex/NodeSelect/NodeSelect.styles'
import { ComingSoonCard, ImporterCard } from '../../components/mex/Settings/Importers'
import { DataInfobarWrapper } from '../../components/mex/Sidebar/DataInfoBar'
import { NavWrapper } from '../../components/mex/Sidebar/Nav'
import { BalloonToolbarBase } from '../../editor/Components/BalloonToolbar'
import { EditorPreviewWrapper } from '../../editor/Components/EditorPreview/EditorPreview.styles'
import { SILink } from '../../editor/Components/ilink/components/ILinkElement.styles'
import { Widget } from '../../editor/Components/SyncBlock'
import { ComboboxItem, ComboboxRoot } from '../../editor/Components/tag/components/TagCombobox.styles'
import { TodoContainer } from '../../ui/components/Todo.style'
import { ArchivedNode } from '../../views/mex/Archive'
import { SettingsOptions, SettingTitle } from '../../views/mex/Settings'
import { SwitchWrapper } from '../../views/router/Switch'
import { BackCard } from '../Card'
import { EditorStyles, NodeInfo, StyledEditor } from '../Editor'
import { GridWrapper } from '../Grid'
import { InfobarTools, InfoBarWrapper } from '../infobar'
import { MenuTrigger, RightCut, ServiceCard } from '../Integration'
import { NavButton } from '../Nav'
import { Result, ResultHeader, SearchContainer, SplitSearchPreviewWrapper } from '../Search'
import { SidebarDiv, StyledTree } from '../Sidebar'
import { CreateSnippet, SSnippet } from '../Snippets'
import { Title } from '../Typography'
import { NeoDarkStylesPlain } from './neoDark.custom'
import { SpaceBlocksCss } from './spaceBlocks'

const palette = { body: '#1B1F3D' }

const listColors = css`
  li::marker {
    color: ${({ theme }) => transparentize(0.5, theme.colors.secondary)};
  }
`
const grayMixerTrans = (n: number) => css`
  ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
`
const grayMainColor = css`
  ${({ theme }) => theme.colors.gray[10]}
`

const heightMain = `calc(100vh - 4rem)`

const containerStyle = css`
  background-color: ${transparentize(0.2, palette.body)};
  box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
`

const containerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
`

const blur = `10px`

const spaceBlocks = SpaceBlocksCss({ containerStyle, containerStyleReset, heightMain, blur })

export const RenarStylesWithoutContainer = css`
  ${NeoDarkStylesPlain}
`

export const RenarStyles = css`
  ${spaceBlocks}
  ${RenarStylesWithoutContainer}
`

const imperialContainerStyle = css`
  background-color: ${transparentize(0.2, palette.body)};
  box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
`

const imperialContainerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
`

const imperialSpaceBlocks = SpaceBlocksCss({
  containerStyle: imperialContainerStyle,
  containerStyleReset: imperialContainerStyleReset,
  heightMain
})

export const ImperialStyles = css`
  ${imperialSpaceBlocks}
  ${RenarStylesWithoutContainer}
`
