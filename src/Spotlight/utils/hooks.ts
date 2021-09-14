/* eslint-disable import/prefer-default-export */
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { isFromSameSource } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { useSaver } from '../../Editor/Components/Saver'
import { IpcAction } from './constants'

export const useCurrentIndex = (data: Array<any> | undefined, search: string): number => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

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

export const useSaveAndExit = () => {
  const [saved, setSaved] = useState(true)

  const { onSave } = useSaver()

  useEffect(() => {
    if (!saved) {
      onSave()
    }
  }, [saved])

  useEffect(() => {
    ipcRenderer.once('save-and-exit', () => {
      setSaved(false)
    })
  }, [])

  return [saved]
}

export const combineSources = (
  oldSourceContent: NodeEditorContent,
  newSourceContent: NodeEditorContent
): NodeEditorContent => {
  let isParagraphSource = false

  const oldSourceIndex = oldSourceContent.length - 1
  const oldSourceChildrenIndex = oldSourceContent[oldSourceIndex].children.length - 1

  const newSourceIndex = 0
  const newSourceChildrenIndex = newSourceContent[newSourceIndex].children.length - 1

  let oldSource = oldSourceContent[oldSourceIndex].children[oldSourceChildrenIndex]
  let newSource = newSourceContent[newSourceIndex].children[newSourceChildrenIndex]

  if (oldSource.type === 'p') {
    oldSource = oldSource.children[oldSource.children.length - 1]
    isParagraphSource = true
  }

  if (newSource.type === 'p') {
    newSource = newSource.children[newSource.children.length - 1]
  }

  const areSameSource = isFromSameSource(oldSource, newSource)

  const removedContent = areSameSource
    ? oldSourceContent.map((content, index) => {
      console.log(index, content)
      if (index === oldSourceIndex) {
        const sliceToIndex = isParagraphSource ? oldSourceChildrenIndex : oldSourceChildrenIndex - 2
        return {
          children: content.children.slice(0, sliceToIndex)
        }
      }
      return content
    })
    : oldSourceContent

  return removedContent
}

export const openNodeInMex = (nodeId: string) => ipcRenderer.send(IpcAction.OPEN_NODE_IN_MEX, { nodeId: nodeId })

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
