import styled from 'styled-components'

export const AllRemindersWrapper = styled.div`
  position: relative;
  margin: ${({ theme: { spacing } }) => `${spacing.large}`};
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-direction: column;
`
