/* eslint-disable import/prefer-default-export */
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { getContent, isFromSameSource } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { useDataSaverFromContent, useSaver } from '../../Editor/Components/Saver'
import { IpcAction } from './constants'
import { useSpotlightContext } from './context'
import { useSpotlightEditorStore } from '../store/editor'
import useLoad from '../../Hooks/useLoad/useLoad'
import { useSpotlightAppStore } from '../store/app'
import { createNodeWithUid } from '../../Lib/helper'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '../../Editor/Store/DataStore'
import { AppType } from '../../Data/useInitialize'
import { appNotifierWindow } from './notifiers'
import { useSaveData } from '../../Data/useSaveData'
import { defaultContent } from '../../Defaults/baseData'

export const useCurrentIndex = (data: Array<any> | undefined): number => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { search, setSearch, selection, setSelection } = useSpotlightContext()
  const setNode = useSpotlightEditorStore((s) => s.setNode)
  const nodeContent = useSpotlightEditorStore((s) => s.nodeContent)
  const loadNode = useSpotlightEditorStore((s) => s.loadNode)
  const saveData = useSaveData()
  const { saveEditorAndUpdateStates } = useDataSaverFromContent()

  const node = useSpotlightEditorStore((s) => s.node)
  const setNodeContent = useSpotlightEditorStore((s) => s.setNodeContent)

  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  const { getNode } = useLoad()
  const addILink = useDataStore((s) => s.addILink)
  const setIsPreview = useSpotlightEditorStore((s) => s.setIsPreview)

  useEffect(() => {
    const dataLength = data ? data.length : 0

    const changeSelection = (ev: any) => {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault()
        setCurrentIndex((prev) => {
          const current = (prev + 1) % dataLength
          if (data[current].new) setIsPreview(false)
          return current
        })
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
        if (currentIndex >= 0) {
          let newNode
          if (data[currentIndex].new) {
            const isDraftNode = node && node.key.startsWith('Draft.')
            newNode = isDraftNode ? node : createNodeWithUid(getNewDraftKey())
            const d = addILink(search, newNode.uid)
            newNode = getNode(newNode.uid)
          } else {
            newNode = getNode(data[currentIndex].uid)
          }

          setSearch('')

          if (selection) {
            const newNodeContent = getContent(newNode.uid)
            const newContentData = !data[currentIndex].new ? [...newNodeContent.content, ...nodeContent] : nodeContent
            saveEditorAndUpdateStates(newNode, newContentData, true)
            saveData()

            appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

            loadNode(createNodeWithUid(getNewDraftKey()), defaultContent.content)
            // setNode(createNodeWithUid(getNewDraftKey()))
            // setNodeContent(undefined)

            setNormalMode(true)
            setSelection(undefined)
          } else {
            setNode(newNode)
            // loadNode(newNode)
            setNormalMode(false)
          }
        }
      }
    }

    if (data) {
      document.addEventListener('keydown', changeSelection)
    } else {
      document.removeEventListener('keydown', changeSelection)
    }

    return () => document.removeEventListener('keydown', changeSelection)
  }, [data, node, currentIndex, selection])

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
