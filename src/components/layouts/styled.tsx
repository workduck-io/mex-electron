import { transparentize } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

export const TabPanel = styled(animated.div)`
  width: 100%;
  height: 100%;

  max-height: 50vh;
  overflow: hidden auto;
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const StyledTab = styled.div.attrs({
  role: 'tab',
  tabIndex: 0
})<{
  selected: boolean
}>`
  display: inline-flex;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.tiny};
  z-index: 1;
  flex: 1;

  ${({ selected }) =>
    !selected &&
    css`
      :hover {
        background: ${({ theme }) => transparentize(0.4, theme.colors.gray[8])};
      }
    `}

  &:focus {
    outline: none;
  }

  cursor: pointer;
`

export const TabBody = styled(animated.div)<{ selected?: boolean }>`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.small};
`

export const TabsContainer = styled(animated.section)<{ visible?: boolean }>`
  padding: 0 ${({ theme }) => theme.spacing.small};
  flex: 1;

  * {
    ${({ visible }) =>
      !visible &&
      css`
        pointer-events: none;
      `}
  }

  width: 100%;
`

export const TabsWrapper = styled.div<{ index: number }>`
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  gap: 0 ${({ theme }) => theme.spacing.small};

  ${({ index }) =>
    css`
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: 33.3333%;
        height: 100%;
        border-radius: ${({ theme }) => theme.borderRadius.small};
        top: 0;
        left: 0;
        background: ${({ theme }) => theme.colors.gray[6]};
        transform: translateX(${index * 100}%);
        transition: background 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
      }
    `}
`

export const TabHeaderContainer = styled.div`
  background: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`
