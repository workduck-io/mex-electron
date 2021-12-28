import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { ColorProp, ColumnContainer } from '../Actions/styled'
import { StyledBackground } from '../Spotlight/styled'

export const StyledResults = styled(ColumnContainer)<{ margin: string }>`
  width: 0;
  margin-top: 4px;
  margin-right: ${({ margin }) => margin && '0.5rem'};
  :focus {
    outline: none;
  }
`

export const StyledRow = styled(animated.div)<ColorProp>`
  ${({ showColor }) =>
    showColor &&
    css`
      ${StyledBackground}
      :hover {
        ${StyledBackground}
      }
    `}
  padding: 10px 1rem;
  margin: 5px 0;
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
`

export const Description = styled.p`
  margin: 4px 0;
  font-size: 12px;
  font-weight: lighter;
  overflow: hidden;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text.fade};
  text-overflow: ellipsis;
`

export const Heading = styled.div`
  font-size: 1.1rem;
  margin: 5px 0 5px;
  font-weight: lighter;
  color: ${({ theme }) => theme.colors.text.fade};
`
