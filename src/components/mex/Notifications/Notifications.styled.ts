import styled from 'styled-components'

export const Notification = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium} `};
  background: ${({ theme }) => theme.colors.background.highlight};
  color: ${({ theme }) => theme.colors.text.default};
  box-shadow: 0px 5px 15px ${({ theme }) => theme.colors.gray[9]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`
