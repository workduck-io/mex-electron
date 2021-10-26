import React, { useEffect, useState } from 'react'
import { FullEditor, StyledEditor } from './styled'
import Editor from '../../../Editor/Editor'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useDataStore from '../../../Editor/Store/DataStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { openNodeInMex } from '../../utils/hooks'
import { SaverButton } from '../../../Editor/Components/Saver'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import { ComboText } from '../../../Editor/Store/Types'
import { AppType } from '../../../Data/useInitialize'
import { appNotifierWindow } from '../../../Spotlight/utils/notifiers'
import { IpcAction } from '../../../Spotlight/utils/constants'

export const isILinkExists = (iLink: string, iLinkList: Array<ComboText>) =>
  iLinkList.filter((item) => item.key === iLink).length !== 0

const NewEditor = () => {
  const { key, uid: nodeId } = useEditorStore((state) => state.node)
  const addILink = useDataStore((s) => s.addILink)

  const ilinks = useDataStore((s) => s.ilinks)

  const setSaved = useContentStore((state) => state.setSaved)
  const fsContent = useEditorStore((state) => state.content)

  const [content, setContent] = useState<any[] | undefined>(undefined)
  const addRecent = useRecentsStore((state) => state.addRecent)

  useEffect(() => {
    if (isILinkExists(nodeId, ilinks)) {
      addRecent(nodeId)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, nodeId)
    }
  }, [])

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, nodeId])

  const onBeforeSave = () => {
    addILink(key, nodeId)
  }

  const onAfterSave = (uid: string) => {
    setSaved(true)
    addRecent(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, uid)
    openNodeInMex(uid)
  }

  return (
    <StyledEditor>
      <FullEditor>
        <Editor
          focusAtBeginning
          // onSave={onSave}
          content={content}
          editorId={nodeId}
        />
        <SaverButton callbackAfterSave={onAfterSave} callbackBeforeSave={onBeforeSave} noButton />
      </FullEditor>
    </StyledEditor>
  )
}

export default NewEditor
