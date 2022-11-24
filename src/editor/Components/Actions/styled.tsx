import { StyledSearch } from '@components/spotlight/Search/styled'
import styled from 'styled-components'

export const RootElement = styled.div`
  position: relative;
`

export const ActionBlockContainer = styled(StyledSearch)`
  background: ${({ theme }) => theme.colors.background.modal};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.small};
`

export const LeftHeader = styled.div`
  display: flex;
  align-items: center;
`
