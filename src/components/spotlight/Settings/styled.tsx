import styled from 'styled-components'
import { ActionTitle, Draggable } from '../Actions/styled'
import { StyledContent } from '../Content/styled'
import { StyledSearch } from '../Search/styled'

export const StyledHeadingContainer = styled(StyledSearch)`
  padding: 0.75rem 0.25rem;
`

export const Title = styled(ActionTitle)`
  font-weight: bold;
  font-size: 1rem;
  margin-left: 1rem;
  margin-bottom: 0px;
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
`

export const SettingsContainer = styled(StyledContent)`
  ${Draggable}
  overflow-y: auto;
  padding: 1rem;
`

export const SettingOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
`
