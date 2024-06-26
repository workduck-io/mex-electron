import styled from 'styled-components'
import { ReminderStyled } from '../../../components/mex/Reminders/Reminders.style'
import { StyledBoard } from '../../../style/Todo'

export const AllRemindersWrapper = styled.div`
  position: relative;
  margin: ${({ theme: { spacing } }) => `0 ${spacing.large}`};
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-direction: column;
`

const ColWidth = `(100vw  / 2 - 20rem)`
const ColHeight = `(100vh - 22rem)`
export const ReminderBoardStyled = styled(StyledBoard)`
  .react-kanban-column {
    width: calc(${ColWidth});
    max-height: calc(${ColHeight});
  }
  ${ReminderStyled} {
    margin: ${({ theme: { spacing } }) => `${spacing.small} 0`};
    width: calc(${ColWidth} - 2 * ${({ theme }) => theme.spacing.medium});
  }
`

export const ReminderColumnHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 1.5rem;
`
