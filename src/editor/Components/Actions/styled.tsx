import { StyledSearch } from '@components/spotlight/Search/styled'
import styled from 'styled-components'

export const ActionBlockContainer = styled(StyledSearch)`
  background: ${({ theme }) => theme.colors.background.highlight};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.tiny};
`

export const LeftHeader = styled.div`
  display: flex;
  align-items: center;
`
