import React, { useEffect, useState } from 'react'
import { FullEditor, StyledEditor } from './styled'
import Editor from '../../../editor/Editor'
import { useEditorStore } from '../../../store/useEditorStore'
import useDataStore from '../../../store/useDataStore'
import { useContentStore } from '../../../store/useContentStore'
import { openNodeInMex } from '../../../utils/combineSources'
import { SaverButton } from '../../../editor/Components/Saver'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { ComboText } from '../../../types/Types'
import { AppType } from '../../../hooks/useInitialize'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { IpcAction } from '../../../data/IpcAction'
import useOnboard from '../../../store/useOnboarding'

export const isILinkExists = (iLink: string, iLinkList: Array<ComboText>) =>
  iLinkList.filter((item) => item.key === iLink).length !== 0

const NewEditor = () => {
  const { key, uid: nodeId } = useEditorStore((state) => state.node)

  const ilinks = useDataStore((s) => s.ilinks)

  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const addILink = useDataStore((s) => s.addILink)
  const setSaved = useContentStore((state) => state.setSaved)
  const addRecent = useRecentsStore((state) => state.addRecent)
  const fsContent = useEditorStore((state) => state.content)

  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (isILinkExists(nodeId, ilinks)) {
      addRecent(nodeId)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, nodeId)
    }
  }, [])

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent.content)
    }
  }, [fsContent, nodeId])

  const onBeforeSave = () => {
    addILink(key, nodeId)
  }

  const onAfterSave = (uid: string) => {
    setSaved(true)
    addRecent(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, uid)

    if (isOnboarding) {
      openNodeInMex(uid)
      changeOnboarding(false)
    }
  }

  return (
    <StyledEditor>
      <FullEditor data-tour="mex-edit-content">
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
