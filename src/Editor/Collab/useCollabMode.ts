import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { SyncElement, toSharedType, withYjs } from 'slate-yjs'
import { createPlateEditor, PlateEditor } from '@udecode/plate'
import { withReact } from 'slate-react'

interface UseCollabModeProps {
  onlineMode?: {
    webSocketEndpoint: string
    documentID: string
    userName: string
    color: string // * rgba string
  }
}

type CollabMode = {
  editor: PlateEditor
  connected: boolean
  toggleConnection: () => void
}

const useCollabMode = ({ onlineMode }: UseCollabModeProps): CollabMode => {
  //  Destruct props helps to avoid memoizing object in parent component
  const { webSocketEndpoint, documentID, userName, color } = onlineMode || {}
  const [connected, setConnected] = useState(false)

  const doc = useMemo(() => new Y.Doc(), [])
  const sharedType = useMemo(() => doc.getArray<SyncElement>('doc'), [doc])

  const provider = useMemo(() => {
    if (webSocketEndpoint && documentID) {
      return new WebsocketProvider(webSocketEndpoint, documentID, doc, { connect: false })
    }
  }, [webSocketEndpoint, documentID, doc])

  useEffect(() => {
    if (provider) {
      provider.on('status', ({ status }: { status: string }) => {
        console.log('Connection status', status)
        setConnected(status === 'connected')
      })

      // * For cursor
      // provider.awareness.setLocalState({
      //   alphaColor: `${color.replace(/, ?[\d.]+\)$/, '')},0.2)`,
      //   color,
      //   name: userName
      // })

      provider.on('sync', (isSynced: boolean) => {
        console.log('Shared Type Length: ', sharedType.length, sharedType)
        if (isSynced && sharedType.length === 0) {
          console.log('Sync status: ', isSynced, sharedType)
          toSharedType(sharedType, [{ children: [{ text: 'Default node content begins..' }] }])
        }
      })

      provider.connect()

      return () => provider.disconnect()
    }
    return undefined
  }, [provider, sharedType])

  const editor = useMemo(() => {
    return withReact(withYjs(createPlateEditor(), sharedType))
  }, [sharedType])

  const toggleConnection = useCallback(() => {
    if (connected) {
      return provider.disconnect()
    }

    provider.connect()
  }, [provider, connected])

  return {
    editor,
    connected,
    toggleConnection
  }
}

export default useCollabMode
