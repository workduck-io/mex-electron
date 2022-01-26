import React, { useEffect, useState } from 'react'
import { IpcAction } from '../../../data/IpcAction'
import { SaverButton } from '../../../editor/Components/Saver'
import Editor from '../../../editor/Editor'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import useOnboard from '../../../store/useOnboarding'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { ILink } from '../../../types/Types'
import { openNodeInMex } from '../../../utils/combineSources'
import { FullEditor, StyledEditor } from './styled'

export const isILinkExists = (iLink: string, iLinkList: Array<ILink>) =>
  iLinkList.filter((item) => item.nodeId === iLink).length !== 0

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
