import styled from 'styled-components'
import { FullWidth } from '../Screen/List'

export const StyledActionFormContainer = styled(FullWidth)`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  padding: ${({ theme }) => theme.spacing.medium};
  margin-top: 1rem;

  display: flex;
  flex-direction: column;
  width: 100%;
`
