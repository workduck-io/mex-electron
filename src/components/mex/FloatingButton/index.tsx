import React, { useState } from 'react'
import styled from 'styled-components'
import QuestionMarkIcon from '@iconify-icons/ri/question-mark'
import CloseIcon from '@iconify-icons/ri/close-line'
import { Icon } from '@iconify/react'
import { useTourData } from '../Onboarding/hooks'
import { Button } from '../../../style/Buttons'
import { useHelpStore } from '../../../store/useHelpStore'
import useOnboard from '../../../store/useOnboarding'
import { useAuthStore } from '../../../services/auth/useAuth'
import { GetIcon } from '../../../data/links'
import { FlexBetween } from '../../spotlight/Actions/styled'
import { useInitOlvy } from '../../../services/Olvy'

export const Float = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
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
  display: block;
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

  const toggleModal = useHelpStore((store) => store.toggleModal)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const authenticated = useAuthStore((store) => store.authenticated)

  const { setOnboardData } = useTourData()

  useInitOlvy()

  const onGettingStartedClick = () => {
    setOnboardData()
    changeOnboarding(true)
  }

  const onShortcutClick = () => {
    setMenu(false)
    toggleModal()
  }

  if (!authenticated) return null

  return (
    <Float>
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
            <MenuItem key="wd-mex-what-is-new-button" id="olvy-target">
              What&apos;s New
            </MenuItem>
            <MenuItem key="wd-mex-shortcuts-button" onClick={onShortcutClick}>
              Shortcuts
            </MenuItem>
          </div>
        </FloatingMenu>
      )}
    </Float>
  )
}

export default FloatingButton
