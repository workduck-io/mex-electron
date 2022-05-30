import { LoadingButton } from '@components/mex/Buttons/LoadingButton'
import { Ellipsis } from '@components/mex/Integrations/Template/styled'
import { ModalOverlay } from '@components/mex/Refactor/styles'
import { Input } from '@style/Form'
import { BodyFont } from '@style/spotlight/global'
import { lighten, rgba, transparentize } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

export const StyledDefault = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.9rem;
`

export const FormLoadingButton = styled(LoadingButton)`
  margin-top: ${(props) => props.theme.spacing.small};
  box-shadow: none !important;
`

export const OnHoverItemBackground = css`
  background-color: ${({ theme }) => lighten(0.01, theme.colors.background.app)};
`

export const MenuForm = styled.form``

export const NoOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ListContainer = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

export const StyledMenuItem = styled.button<{ highlight?: boolean }>`
  display: flex;
  border: none;
  user-select: none;
  background-color: ${({ theme, highlight }) =>
    highlight ? theme.colors.background.app : theme.colors.background.card};

  :focus {
    outline: none;
  }

  :hover {
    ${OnHoverItemBackground}
  }

  padding: ${(props) => props.theme.spacing.small};
  border-radius: ${(props) => props.theme.borderRadius.small};
  align-items: center;
  ${BodyFont};
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
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100%;
  height: 31rem;
  border-radius: ${(props) => props.theme.borderRadius.small};
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
  ${Ellipsis};
  ${BodyFont};
`

export const MenuContainer = styled(animated.div)`
  z-index: 3;
  margin: 0 ${(props) => props.theme.spacing.medium} ${(props) => props.theme.spacing.medium} 0;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background.card};
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.medium};
  height: 28rem;
  min-height: 28rem;
`
