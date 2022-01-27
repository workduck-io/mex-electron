import React, { useEffect, useRef, useState } from 'react'
import { useLayoutStore } from '../../../store/useLayoutStore'
import QuestionMarkIcon from '@iconify-icons/ri/question-mark'
import CloseIcon from '@iconify-icons/ri/close-line'
import { useOnboardingData } from '../Onboarding/hooks'
import { useHelpStore } from '../../../store/useHelpStore'
import useOnboard from '../../../store/useOnboarding'
import { useAuthStore } from '../../../services/auth/useAuth'
import { GetIcon } from '../../../data/links'
import { FlexBetween } from '../../spotlight/Actions/styled'
import { useInitOlvy } from '../../../services/olvy'
import { Float, FloatingMenu, FloatButton, ClickableIcon, MenuItem } from './styled'
import { useLocation, useHistory } from 'react-router-dom'
import { MexIcon } from '../../../style/Layouts'

const FloatingMenuActions: React.FC<{
  onTourClick: () => void
  onShortcutClick: () => void
  setMenu: (val: boolean) => void
}> = ({ onTourClick, onShortcutClick, setMenu }) => {
  const menuRef = useRef(null)

  const handleOutsideClick = (event) => {
    if (menuRef?.current && !menuRef?.current?.contains(event.target)) {
      setMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <FloatingMenu ref={menuRef}>
      <FlexBetween>
        <h3>Help</h3>
        <ClickableIcon onClick={() => setMenu(false)} width="24" icon={CloseIcon} />
      </FlexBetween>

      <div>
        <MenuItem key="wd-mex-getting-started-button" onClick={onTourClick}>
          <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:book-24-filled" /> Getting Started
        </MenuItem>
        <MenuItem key="wd-mex-what-is-new-button" id="olvy-target">
          <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:gift-24-filled" /> What&apos;s New
        </MenuItem>
        <MenuItem key="wd-mex-shortcuts-button" onClick={onShortcutClick}>
          <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:keyboard-24-filled" /> Keyboard Shortcuts
        </MenuItem>
      </div>
    </FloatingMenu>
  )
}

const FloatingButton = () => {
  const [showMenu, setMenu] = useState<boolean>(false)

  const toggleModal = useHelpStore((store) => store.toggleModal)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const authenticated = useAuthStore((store) => store.authenticated)
  const { setOnboardData } = useOnboardingData()

  const history = useHistory()
  const location = useLocation()

  useInitOlvy(showMenu)

  const onGettingStartedClick = () => {
    // * Set Integration data (Like tour flow block)
    setOnboardData()
    // * Load Tour node

    // * If not on editor page
    if (location.pathname !== '/editor') {
      history.push('/editor')
    }

    // * Start Product Tour
    changeOnboarding(true)
  }

  const onShortcutClick = () => {
    setMenu(false)
    toggleModal()
  }

  if (!authenticated) return null

  return (
    <Float focusMode={focusMode}>
      {!showMenu ? (
        <FloatButton id="wd-mex-floating-button" key="wd-mex-floating-button" onClick={() => setMenu(true)}>
          {GetIcon(QuestionMarkIcon)}
        </FloatButton>
      ) : (
        <FloatingMenuActions onTourClick={onGettingStartedClick} onShortcutClick={onShortcutClick} setMenu={setMenu} />
      )}
    </Float>
  )
}

export default FloatingButton
