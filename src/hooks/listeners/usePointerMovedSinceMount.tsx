import React, { useEffect, useState } from 'react'

function usePointerMovedSinceMount() {
  const [moved, setMoved] = useState(false)

  useEffect(() => {
    function handler() {
      setMoved(true)
    }

    if (!moved) {
      window.addEventListener('pointermove', handler)
      return () => window.removeEventListener('pointermove', handler)
    }
  }, [moved])

  return moved
}

export default usePointerMovedSinceMount
