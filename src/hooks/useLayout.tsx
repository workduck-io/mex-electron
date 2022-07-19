import { FocusMode, useLayoutStore } from '../store/useLayoutStore'

const useLayout = () => {
  const toggleFocusModeBool = useLayoutStore((store) => store.toggleFocusMode)
  const setFocusMode = useLayoutStore((store) => store.setFocusMode)

  const toggleFocusMode = () => {
    // if (useLayoutStore.getState().focusMode) {
    toggleFocusModeBool()
    // } else {
    // toggleFocusModeBool()
    // }
  }

  const setFocusHover = (focusMode: FocusMode) => {
    setFocusMode(focusMode)
    // if (focusMode.on) {
    //   showInfobar()
    // } else {
    //   hideInfobar()
    // }
  }

  const getFocusProps = (focusMode: FocusMode) => {
    return {
      onMouseEnter: () => {
        if (focusMode.on) setFocusHover({ on: true, hover: true })
      },
      onMouseLeave: () => {
        if (focusMode.on) setFocusHover({ on: true, hover: false })
      },
      focusMode: focusMode.on,
      focusHover: focusMode.hover
    }
  }
  return { toggleFocusMode, setFocusHover, getFocusProps }
}

export default useLayout
