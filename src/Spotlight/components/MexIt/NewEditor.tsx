import React, { useEffect, useState } from 'react'
import { FullEditor, StyledEditor } from './styled'
import Editor from '../../../Editor/Editor'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useDataStore from '../../../Editor/Store/DataStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { openNodeInMex } from '../../utils/hooks'
import { SaverButton } from '../../../Editor/Components/Saver'

const NewEditor = () => {
  const nodeId = useEditorStore(({ node }) => node.id)
  const addILink = useDataStore((s) => s.addILink)

  const setSaved = useContentStore((state) => state.setSaved)
  const fsContent = useEditorStore((state) => state.content)

  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, nodeId])

  const onSave = () => {
    addILink(nodeId)
    setSaved(true)
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
        <SaverButton callbackAfterSave={onSave} noButton />
      </FullEditor>
    </StyledEditor>
  )
}

export default NewEditor
