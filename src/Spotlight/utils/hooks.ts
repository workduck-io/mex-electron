/* eslint-disable import/prefer-default-export */
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { isFromSameSource } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { useSaver } from '../../Editor/Components/Saver'
import { IpcAction } from './constants'
import { useSpotlightContext } from './context'
import { useSpotlightEditorStore } from '../store/editor'
import useLoad from '../../Hooks/useLoad/useLoad'
import { useSpotlightAppStore } from '../store/app'
import { createNodeWithUid } from '../../Lib/helper'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '../../Editor/Store/DataStore'

export const useCurrentIndex = (data: Array<any> | undefined): number => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { search } = useSpotlightContext()
  const setNode = useSpotlightEditorStore((s) => s.setNode)
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)
  const { getNode } = useLoad()
  const addILink = useDataStore((s) => s.addILink)

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

      if (ev.key === 'Enter') {
        ev.preventDefault()
        setCurrentIndex((i) => {
          let newNode
          if (i === 0) {
            const uid = addILink(search)
            newNode = getNode(uid)
          } else {
            newNode = getNode(data[i].uid)
          }
          setNode(newNode)
          setNormalMode(false)
          return i
        })
      }
    }

    if (data) {
      document.addEventListener('keydown', changeSelection)
    } else {
      document.removeEventListener('keydown', changeSelection)
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

export const openNodeInMex = (nodeId: string) => {
  // * Open saved node in Mex
  ipcRenderer.send(IpcAction.OPEN_NODE_IN_MEX, { nodeId: nodeId })
}

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
