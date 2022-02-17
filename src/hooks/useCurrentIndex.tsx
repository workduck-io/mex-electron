import { useEffect, useState } from 'react'
import { defaultContent } from '../data/Defaults/baseData'
import { IpcAction } from '../data/IpcAction'
import { useDataSaverFromContent } from '../editor/Components/Saver'
import { getNewDraftKey } from '../editor/Components/SyncBlock/getNewBlockData'
import { appNotifierWindow } from '../electron/utils/notifiers'
import { useSpotlightAppStore } from '../store/app.spotlight'
import { SearchType, useSpotlightContext } from '../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../store/editor.spotlight'
import useDataStore from '../store/useDataStore'
import { NodeProperties } from '../store/useEditorStore'
import { getContent } from '../utils/helpers'
import { createNodeWithUid } from '../utils/lib/helper'
import { AppType } from './useInitialize'
import useLoad from './useLoad'
import { useSaveData } from './useSaveData'

export const useCurrentIndex = (data: Array<any> | undefined): number => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { search, setSearch, selection, setSelection } = useSpotlightContext()
  const setNode = useSpotlightEditorStore((s) => s.setNode)
  const nodeContent = useSpotlightEditorStore((s) => s.nodeContent)
  const loadNode = useSpotlightEditorStore((s) => s.loadNode)
  const { saveData } = useSaveData()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

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
          let newNode: NodeProperties
          if (data[currentIndex].new) {
            const isDraftNode = node && node.path.startsWith('Draft.')
            newNode = isDraftNode ? node : createNodeWithUid(getNewDraftKey())
            // FIXME: STALE USE OF ADDILINK. USE CALLBACK (not updated as useCurrentIndex not used)
            // addILink(search.value, newNode.nodeid)
            newNode = getNode(newNode.nodeid)
          } else {
            newNode = getNode(data[currentIndex].nodeid)
          }

          setSearch({ value: '', type: SearchType.search })

          if (selection) {
            const newNodeContent = getContent(newNode.nodeid)
            const newContentData = !data[currentIndex].new ? [...newNodeContent.content, ...nodeContent] : nodeContent
            saveEditorValueAndUpdateStores(newNode.nodeid, newContentData, true)
            saveData()

            appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

            loadNode(createNodeWithUid(getNewDraftKey()), defaultContent.content)

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
