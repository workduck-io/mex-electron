import { ipcRenderer } from 'electron'
import tinykeys from 'tinykeys'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FileData } from '../../Types/data'
import { useInitialize } from '../../Data/useInitialize'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import useDataStore from '../../Editor/Store/DataStore'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import { getHtmlString } from '../components/Source'

export const useLocalShortcuts = () => {
  const history = useHistory()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        ipcRenderer.send('close')
      },
      Tab: (event) => {
        event.preventDefault()
        history.replace('/new')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}

export const useMexPageShortcuts = () => {
  const history = useHistory()
  const nodeId = useEditorStore((state) => state.node.id)
  const { setSelection } = useSpotlightContext()
  const removeILink = useDataStore((state) => state.removeILink)

  const { isNew, setIsNew, removeContent } = useContentStore(({ isNew, setIsNew, removeContent }) => ({
    isNew,
    setIsNew,
    removeContent
  }))

  const handleCancel = () => {
    if (isNew) {
      setIsNew(false)
      // removeContent(nodeId)
      // removeILink(nodeId)
      setSelection(undefined)
    }
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        handleCancel()
        history.replace('/')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}

type SpotlightContextType = {
  search: string
  setSearch: (val: any) => void
  selection: any
  localData: FileData | undefined
  setSelection: (val: any) => void
}

const SpotlightContext = createContext<SpotlightContextType>(undefined!)

export const SpotlightProvider: React.FC = ({ children }) => {
  const [search, setSearch] = useState<string>('')
  const [selection, setSelection] = useState<any>()
  const [localData, setLocalData] = useState<FileData>()

  const { init } = useInitialize()

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
    localData
  }

  useEffect(() => {
    ipcRenderer.on('selected-text', (_event, data) => {
      if (!data) setSelection(undefined)
      else {
        const source = getHtmlString(data?.metadata)
        const text: string = data?.text

        const html = {
          ...data,
          text: text.concat(source)
        }

        setSelection(html)
      }
    })

    ipcRenderer.on('recieve-local-data', (_event, arg: FileData) => {
      const editorID = getNewDraftKey()
      init(arg, editorID)
      setLocalData(arg)
    })

    ipcRenderer.send('get-local-data')
  }, [])

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
}

export const useSpotlightContext = () => useContext(SpotlightContext)
