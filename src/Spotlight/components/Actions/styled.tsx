import styled, { css } from 'styled-components'
import { Scroll } from '../../styles/layout'
import { StyledBackground } from '../Spotlight/styled'

export interface ColorProp {
  showColor: boolean
}

export const Draggable = css`
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`

export const StyledUndordered = styled.ul`
  margin-block-end: 0 !important;
`

export const ColumnContainer = styled.div`
  flex: 4;
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  color: rgb(51, 51, 51);
  height: 100%;
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: 0.1px;
  font-style: normal;
  font-variant-ligatures: normal;
  font-variant-caps: normal;
  font-weight: bold;
  ${Scroll}/* ${Draggable} */
`

export const Action = styled.div`
  margin: 0.5rem 0 0.5rem;
`

export const ActionTitle = styled.div`
  font-size: 0.8rem;
  margin-bottom: 4px;
  color: rgb(141, 141, 141);
`

export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CreateMex = styled.div<ColorProp>`
  ${({ showColor }) => showColor && StyledBackground}
  width: 100%;
  align-items: center;
  border-radius: 8px;
  padding: 0.5rem;
  font-weight: lighter;
  font-size: 0.9rem;
  display: flex;
`

export const ActionDesc = styled.div<ColorProp>`
  ${({ showColor }) => showColor && StyledBackground}
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
