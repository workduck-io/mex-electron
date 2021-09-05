import React, { useEffect, useState } from 'react'
import { FullEditor, StyledEditor } from './styled'
import Editor from '../../../Editor/Editor'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useDataStore from '../../../Editor/Store/DataStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { useSaveData } from '../../../Data/useSaveData'
import { useStoreEditorValue } from '@udecode/plate-core'
import { openNodeInMex } from '../../../Spotlight/utils/hooks'

const NewEditor = () => {
  const nodeId = useEditorStore(({ node }) => node.id)
  const addILink = useDataStore((s) => s.addILink)

  const setFsContent = useContentStore((state) => state.setContent)
  const setSaved = useContentStore((state) => state.setSaved)

  const editorState = useStoreEditorValue()
  const fsContent = useEditorStore((state) => state.content)

  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, nodeId])

  const saveData = useSaveData()

  const onSave = () => {
    addILink(nodeId)
    if (editorState) {
      setFsContent(nodeId, editorState)
    }
    saveData()
    setSaved(true)
    openNodeInMex(nodeId)
  }

  return (
    <StyledEditor>
      <FullEditor>
        <Editor onSave={onSave} content={content} editorId={nodeId} />
      </FullEditor>
    </StyledEditor>
  )
}

export default NewEditor
