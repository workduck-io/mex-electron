import styled, { css } from 'styled-components'
import { Scroll } from '../../../Spotlight/styles/layout'

export const StyledRecent = styled.div`
  ${Scroll}
  padding: 0 0.5rem;
  flex: 5;
  font-weight: bold;
  border-radius: 1rem;
  line-height: 1.65;
  letter-spacing: 0.1px;
`

export const StyledRecentList = styled.div`
  display: flex;
  flex-direction: column-reverse;
`

export const Clickable = css`
  cursor: pointer;
`

export const RecentBetween = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Faded = styled.div`
  margin-bottom: 4px;
  ${Clickable}
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: 0.9rem;
`

export const StyledRecentRow = styled.div<{ highlight: boolean }>`
  align-items: center;
  display: flex;
  margin-top: 4px;
  border-radius: 8px;
  padding: 1rem 0.5rem;
  font-weight: lighter;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.fade};
  background: ${({ theme, highlight }) =>
    highlight ? theme.colors.background.modal : theme.colors.background.highlight};
`
