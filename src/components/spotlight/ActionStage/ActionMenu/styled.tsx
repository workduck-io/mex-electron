import { ModalOverlay } from '@components/mex/Refactor/styles'
import { StyledBackground } from '@components/spotlight/styled'
import { Input } from '@style/Form'
import { BodyFont, MainFont } from '@style/spotlight/global'
import { rgba, transparentize } from 'polished'
import { animated } from 'react-spring'
import styled from 'styled-components'

export const StyledDefault = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.9rem;
`

export const StyledMenuItem = styled.div<{ highlight?: boolean }>`
  display: flex;
  user-select: none;
  background-color: ${({ theme, highlight }) => highlight && theme.colors.background.app};

  :hover {
    ${StyledBackground}
  }

  padding: ${(props) => props.theme.spacing.medium};
  border-radius: ${(props) => props.theme.borderRadius.small};
  align-items: center;
  font-size: ${BodyFont};
  margin-bottom: ${(props) => props.theme.spacing.small};
  cursor: pointer;
  width: 100%;
  color: ${({ theme }) => theme.colors.text.default};
  box-sizing: border-box;
  justify-content: space-between;
`

export const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  margin: ${(props) => props.theme.spacing.small} 0;
`

export const MenuFooter = styled.div`
  width: 100%;

  ${Input} {
    width: 100%;
    box-sizing: border-box;
  }
`

export const MenuBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const Overlay = styled.div`
  position: fixed;
  top: 0.3rem;
  left: 0.1rem;
  width: 100vw;
  height: 100vh;
  ${ModalOverlay};
  z-index: 1;
  background-color: ${({ theme }) => rgba(theme.colors.palette.black, 0.5)};

  transition: background-color 0.5s ease;

  align-items: flex-end;
  justify-content: flex-end;
`

export const MenuTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.heading};
  font-weight: bold;
  font-size: ${MainFont};
`

export const MenuContainer = styled(animated.div)`
  z-index: 3;
  margin: 0 ${(props) => props.theme.spacing.medium} ${(props) => props.theme.spacing.medium} 0;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => transparentize(0.35, theme.colors.background.card)};
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.medium};
  min-height: 85vh;
`
