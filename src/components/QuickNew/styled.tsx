import styled, { css } from 'styled-components'
import Modal from 'react-modal'
import { transparentize } from 'polished'

export const FleetStyled = styled.section<{ index: number, total: number }>`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  align-items: center;

  ${({ index, total }) =>
    css`
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: calc(100% / ${total}); 
        height: 100%;
        border-radius: ${({ theme }) => theme.borderRadius.large};
        top: 0;
        left: 0;
        box-shadow: inset 0 0 50px ${({ theme }) => theme.colors.gray[10]}; 
        background-color: ${({ theme }) => transparentize(0, theme.colors.background.app)};
        transform: translateX(${index * 100}%);
        transition: background 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
      }
    `}
`

export const StyledModal = styled(Modal)`
  /* width: 44rem;  */
`

export const FleetSectionTitle = styled.div`
  width: 8rem; 
  display: flex;
  justify-content: center;
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
`

export const AnimateZoom = styled.span<{ selected?: boolean }>`
  transition: transform .2s;

  ${({ selected }) => selected && css`
    transform: scale(1.15)
  `
  }
`

export const FleetSection = styled.div<{ highlight?: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: flex;
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.large}`}; 
  flex-direction: column;
  z-index: 1;
  align-items: center;
  justify-content: center;
  transition: color 0.1s;
    ${({ highlight, theme }) => highlight ? css`
        color: ${theme.colors.primary};`
    : css`
        opacity: 0.5;
        color: ${theme.colors.text.default};
`}
  gap: ${({ theme }) => theme.spacing.medium};
`
