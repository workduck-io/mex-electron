import styled, { css } from 'styled-components'
import { rgba, transparentize } from 'polished'

const ModalContent = css`
  width: max-content;
  height: max-content;
  margin: auto;
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: 0px 20px 100px ${({ theme }) => transparentize(0.75, theme.colors.primary)};
  overflow: visible;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.gray[8]};
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
  min-height: 240px;
  min-width: 400px;
`

const ModalOverlay = css`
  position: fixed;
  inset: 0px;
  display: flex;
  background-color: ${({ theme }) => rgba(theme.colors.palette.black, 0.5)};
`

export const RefactorStyles = css`
  .RefactorContent {
    ${ModalContent}
  }
  .RefactorOverlay {
    ${ModalOverlay}
  }
`

export const ModalHeader = styled.h1`
  font-size: 1.5;
  color: ${({ theme }) => theme.colors.text.heading};
  margin: ${({ theme: { spacing } }) => `${spacing.large} 0`};
`

export const MockRefactorMap = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[10])};
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin: ${({ theme: { spacing } }) => `${spacing.large} 0`};
`

export const MRMHead = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  h1 {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.gray[4]};
    font-weight: 700;
    margin: 0;
    /* flex: 1; */
  }
`

export const MRMRow = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.small}`};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  &:nth-child(2n) {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  }
  p {
    margin: 0;
    /* flex: 1; */

    &:first-child {
      color: ${({ theme }) => theme.colors.text.fade};
    }
  }
`

export const ArrowIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.accent};
  margin: 0 ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
`

export const ModalControls = styled.div`
  margin: ${({ theme: { spacing } }) => `${spacing.large} 0 ${spacing.medium}`};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
