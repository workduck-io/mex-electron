import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width: number | undefined
  height: number | undefined
}

// Hook
export const useWindowSize = (): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Debounce to prevent excessive calls
    const debouncedHandleResize = debounce(handleResize, 200)
    // Add event listener
    window.addEventListener('resize', debouncedHandleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  return windowSize
}
