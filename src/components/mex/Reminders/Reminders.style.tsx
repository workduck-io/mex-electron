import styled from 'styled-components'
import { Title } from '../../../style/Typography'

export const RemindersWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.medium} 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  height: 100%;
`

export const ReminderGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  height: 100%;

  & > ${Title} {
    font-size: 1.5rem;
    font-weight: normal;
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
`

export const Reminder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => theme.colors.gray[9]};

  ${Title} {
    margin: 0;
    font-size: 1.25rem;
    font-weight: normal;
  }
`

export const ReminderTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: ${({ theme }) => theme.colors.text.fade};
`

export const ReminderExact = styled.div``
export const ReminderRelative = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  svg {
    height: 1.2rem;
    width: 1.2rem;
    color: ${({ theme }) => theme.colors.gray[5]};
  }
`

export const ReminderInfobar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  margin: 0 ${({ theme }) => theme.spacing.medium};

  & > ${Title} {
    margin: ${({ theme }) => theme.spacing.large} 0 0;
  }
`
export const SelectedDate = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  margin-top: ${({ theme }) => theme.spacing.small};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  justify-content: center;
  align-items: center;
  max-width: 325px;

  i {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.fade};
  }
`
