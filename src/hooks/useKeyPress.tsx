import { useEffect, useState } from 'react'

export const useKeyPress = (pressedKey: string): boolean => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  const onKeyDown = ({ key }) => {
    if (key === pressedKey) {
      setIsPressed(true)
    }
  }
  const onKeyUp = ({ key }) => {
    if (key === pressedKey) {
      setIsPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return isPressed
}
