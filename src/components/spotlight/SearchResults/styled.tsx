import { ColorProp, ColumnContainer } from '../Actions/styled'
import styled, { css } from 'styled-components'

import { StyledBackground } from '../styled'
import { animated } from 'react-spring'
import { transparentize } from 'polished'

export const StyledResults = styled(ColumnContainer)<{ margin: string }>`
  margin-top: 4px;
  margin-right: ${({ margin }) => margin && '0.5rem'};
  :focus {
    outline: none;
  }
`

export const StyledRow = styled(animated.div)<ColorProp>`
  /* transform: translateY(${(props) => props.start}px); */
  padding: 12px 1rem 12px 0;
  :hover {
    background-color: ${({ theme }) => transparentize(0.65, theme.colors.background.modal)};
    /* padding: 10px 1rem 10px 0; */
  }
  ${({ showColor }) =>
    showColor &&
    css`
      ${StyledBackground}/* padding: 10px 1rem 10px 0; */
    `}
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  /* margin: 5px 0; */
  user-select: none;
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
`

export const Description = styled.p`
  margin: 6px 0 4px;
  font-size: 12px;
  font-weight: 300;
  white-space: nowrap;
  overflow-x: hidden;
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
