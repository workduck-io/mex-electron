/* eslint-disable import/prefer-default-export */
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'

export const useCurrentIndex = (data: Array<any> | undefined, search: string) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const dataLength = data ? data.length : 0

    const changeSelection = (ev: any) => {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault()
        setCurrentIndex((prev) => (prev + 1) % dataLength)
      }

      if (ev.key === 'ArrowUp') {
        ev.preventDefault()
        setCurrentIndex((prev) => {
          const newValue = (prev - 1) % dataLength
          return newValue < 0 ? newValue + dataLength : newValue
        })
      }
    }

    if (data) {
      document.addEventListener('keydown', changeSelection)
    }

    return () => document.removeEventListener('keydown', changeSelection)
  }, [data])

  useEffect(() => {
    if (search) {
      setCurrentIndex(0)
    }
  }, [search])

  return currentIndex
}

export const openNodeInMex = (nodeId: string) => ipcRenderer.send('open-node-in-mex', { nodeId: nodeId })
