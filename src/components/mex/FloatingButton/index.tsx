import Tippy from '@tippyjs/react'
import CloseIcon from '@iconify/icons-ri/close-line'
import QuestionMarkIcon from '@iconify/icons-ri/question-mark'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import AutoformatHelp from '../../../data/initial/AutoformatHelp'
import { GetIcon } from '../../../data/links'
import { useAuthStore } from '../../../services/auth/useAuth'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import useOnboard from '../../../store/useOnboarding'
import { FOCUS_MODE_OPACITY } from '../../../style/consts'
import { MexIcon } from '../../../style/Layouts'
import { FocusModeProp } from '../../../style/props'
import { FlexBetween } from '../../spotlight/Actions/styled'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { Button } from '@workduck-io/mex-components'

export const Float = styled.div<FocusModeProp>`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  ${({ $focusMode }) =>
    $focusMode &&
    css`
      opacity: ${FOCUS_MODE_OPACITY};
      &:hover {
        opacity: 1;
      }
    `}
`

export const FloatButton = styled(Button)`
  border-radius: 50%;
  height: 3.2rem;
  cursor: pointer;
  width: 3.2rem;
  padding: 0.8rem;
  :hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const FloatingMenu = styled.div`
  height: fit-content;
  max-height: 400px;
  width: 250px;

  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.card};
`

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.card};
  :hover {
    cursor: pointer;
    border-radius: 0.5rem;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`

export const ClickableIcon = styled(Icon)`
  cursor: pointer;
  border-radius: 50%;
  :hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const FloatingButton = () => {
  const [showMenu, setMenu] = useState<boolean>(false)

  const toggleShortcutModal = useHelpStore((store) => store.toggleModal)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const showLoader = useLayoutStore((store) => store.showLoader)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const authenticated = useAuthStore((store) => store.authenticated)
  const toggleModal = useModalStore((store) => store.toggleOpen)

  // * For release notes
  // useInitOlvy(showMenu)

  const onGettingStartedClick = () => {
    changeOnboarding(true)
  }

  const onShortcutClick = () => {
    setMenu(false)
    toggleShortcutModal()
  }

  const handleWhatsNew = () => {
    toggleModal(ModalsType.releases)
  }

  if (!authenticated || showLoader) return null

  return (
    <Float $focusMode={focusMode.on}>
      {!showMenu ? (
        <FloatButton id="wd-mex-floating-button" key="wd-mex-floating-button" onClick={() => setMenu(true)}>
          {GetIcon(QuestionMarkIcon)}
        </FloatButton>
      ) : (
        <FloatingMenu>
          <FlexBetween>
            <h3>Help</h3>
            <ClickableIcon onClick={() => setMenu(false)} width="24" icon={CloseIcon} />
          </FlexBetween>

          <div>
            {/* TODO: Uncomment this when we have onboarding
              <MenuItem key="wd-mex-getting-started-button" onClick={onGettingStartedClick}>
              Getting Started
            </MenuItem> */}
            {/* <MenuItem key="wd-mex-what-is-new-button" id="olvy-target">
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:gift-24-filled" /> What&apos;s New
            </MenuItem> */}
            <MenuItem key="wd-mex-what-is-new-button" onClick={handleWhatsNew}>
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:gift-24-filled" /> What&apos;s New
            </MenuItem>
            <Tippy interactive theme="markdown-help" placement="right" content={<AutoformatHelp />}>
              <MenuItem key="wd-mex-shortcuts-button">
                <MexIcon fontSize={20} margin="0 1rem 0 0" icon="ri:text" /> Markdown Hints
              </MenuItem>
            </Tippy>
            <MenuItem key="wd-mex-shortcuts-button" onClick={onShortcutClick}>
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:keyboard-24-filled" /> Keyboard Shortcuts
            </MenuItem>
          </div>
        </FloatingMenu>
      )}
    </Float>
  )
}

export default FloatingButton
