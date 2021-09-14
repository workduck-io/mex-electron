import { Icon } from '@iconify/react'
import styled from 'styled-components'

export const StyledContainer = styled.div``

export const StyledSetting = styled.div`
  align-items: center;
  display: flex;
  border-radius: 8px;
  padding: 0.8rem 0.5rem;
  font-weight: lighter;
  font-size: 0.9rem;
`

export const StyledIcon = styled(Icon)`
  color: ${({ theme, color }) => (color ? theme.colors.palette.green : theme.colors.palette.red)};
`

export const MarginHorizontal = styled.div`
  margin: 0 1rem;
`
