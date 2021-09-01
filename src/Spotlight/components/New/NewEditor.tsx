import React, { useEffect, useState } from 'react'
import { FullEditor, StyledEditor } from './styled'
import Editor from '../../../Editor/Editor'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useDataStore from '../../../Editor/Store/DataStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import { useSaveData } from '../../../Data/useSaveData'
import { useStoreEditorValue } from '@udecode/plate-core'

const NewEditor = () => {
  const loadNodeFromId = useEditorStore(({ loadNodeFromId }) => loadNodeFromId)
  const nodeId = useEditorStore(({ node }) => node.id)
  const addILink = useDataStore((s) => s.addILink)
  const ilinks = useDataStore((s) => s.ilinks)
  const { isNew, setIsNew } = useContentStore(({ isNew, setIsNew }) => ({ isNew, setIsNew }))

  const setFsContent = useContentStore((state) => state.setContent)

  const editorState = useStoreEditorValue()
  const fsContent = useEditorStore((state) => state.content)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, nodeId])

  const saveData = useSaveData()

  const onSave = () => {
    if (ilinks.filter((item) => item.key === nodeId).length === 0) {
      addILink(nodeId)
    }
    if (editorState) {
      setFsContent(nodeId, editorState)
    }
    saveData()
  }

  useEffect(() => {
    if (!isNew) {
      setIsNew(true)
      const draftMexKey = getNewDraftKey()

      addILink(draftMexKey)
      loadNodeFromId(draftMexKey)
    } else {
      loadNodeFromId(nodeId)
    }
  }, [])

  return (
    <StyledEditor>
      <FullEditor>
        <Editor onSave={onSave} content={content} editorId={nodeId} />
      </FullEditor>
    </StyledEditor>
  )
}

export default NewEditor
