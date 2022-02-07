import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { ColorProp, ColumnContainer } from '../Actions/styled'
import { StyledBackground } from '../styled'

export const StyledResults = styled(ColumnContainer)<{ margin: string }>`
  margin-top: 4px;
  margin-right: ${({ margin }) => margin && '0.5rem'};
  :focus {
    outline: none;
  }
`

export const StyledRow = styled(animated.div)<ColorProp>`
  /* transform: translateY(${(props) => props.start}px); */

  ${({ showColor }) =>
    showColor &&
    css`
      ${StyledBackground}
      :hover {
        ${StyledBackground}
      }
    `}
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 1rem 10px 0;
  margin: 5px 0;
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
`

export const Description = styled.p`
  margin: 6px 0 4px;
  font-size: 12px;
  font-weight: 300;
  overflow: hidden;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text.fade};
  opacity: 0.7;
  text-overflow: ellipsis;
`

export const Heading = styled.div`
  font-size: 1.1rem;
  margin: 5px 0 5px;
  font-weight: lighter;
  color: ${({ theme }) => theme.colors.text.fade};
`
