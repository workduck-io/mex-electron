import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { Scroll } from '../../../style/spotlight/layout'
import { StyledBackground } from '../styled'

export interface ColorProp {
  showColor?: boolean
  start?: number
}

export const Draggable = css`
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`

export const StyledUndordered = styled.ul`
  margin-block-end: 0 !important;
`

export const ColumnContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: rgb(51, 51, 51);
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: 0.1px;
  font-style: normal;
  font-variant-ligatures: normal;
  font-variant-caps: normal;
  font-weight: bold;
  ${Scroll}
  ${Draggable}
`

export const Action = styled.div`
  margin: 0.5rem 0 0.5rem;
`

export const ActionTitle = styled.div`
  font-size: 0.8rem;
  user-select: none;
  margin: 8px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text.heading};
`

export const ActionDescStyled = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
  display: flex;
  flex: 1;
  align-items: center;
`

export const FlexBetween = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const CreateMex = styled.div<ColorProp>`
  ${({ showColor }) => showColor && StyledBackground}
  align-items: center;
  display: flex;
  border-radius: 8px;
  padding: 0.8rem 0.5rem;
  font-weight: lighter;
  font-size: 0.9rem;
`

export const ActionDesc = styled.div<ColorProp>`
  ${({ showColor }) => showColor && StyledBackground}
  color: ${({ theme }) => theme.colors.text.fade};
  font-weight: lighter;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`
