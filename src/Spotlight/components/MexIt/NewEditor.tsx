import React, { useEffect, useState } from 'react'
import { FullEditor, StyledEditor } from './styled'
import Editor from '../../../Editor/Editor'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useDataStore from '../../../Editor/Store/DataStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { openNodeInMex } from '../../utils/hooks'
import { SaverButton } from '../../../Editor/Components/Saver'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'

const NewEditor = () => {
  const nodeId = useEditorStore(({ node }) => node.id)
  const addILink = useDataStore((s) => s.addILink)

  const setSaved = useContentStore((state) => state.setSaved)
  const fsContent = useEditorStore((state) => state.content)

  const [content, setContent] = useState<any[] | undefined>(undefined)
  const addRecent = useRecentsStore((state) => state.addRecent)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, nodeId])

  const onBeforeSave = () => {
    addILink(nodeId)
  }

  const onAfterSave = () => {
    setSaved(true)
    addRecent(nodeId)
    openNodeInMex(nodeId)
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
