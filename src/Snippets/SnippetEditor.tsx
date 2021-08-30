import saveLine from '@iconify-icons/ri/save-line'
import { useStoreEditorValue } from '@udecode/plate'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ReactTooltip from 'react-tooltip'
import { useSaveData } from '../Data/useSaveData'
import Editor from '../Editor/Editor'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import IconButton from '../Styled/Buttons'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor'

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const editorState = useStoreEditorValue()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (snippet) {
      setContent(snippet.content)
    }
  }, [snippet, snippet.id])

  const saveData = useSaveData()

  const onSave = () => {
    // On save the editor should serialize the state to markdown plaintext
    // setContent then save
    console.log('Saving', editorState)

    if (editorState) updateSnippet(snippet.id, { ...snippet, content: editorState })
    saveData()

    toast('Snippet Saved!', { duration: 1000 })
  }

  return (
    <>
      <StyledEditor className="snippets_editor">
        <NodeInfo>
          <NoteTitle>Snippets Editor: {snippet && snippet.title}</NoteTitle>
          <InfoTools>
            <IconButton size={24} icon={saveLine} onClick={onSave} title="Save" />
          </InfoTools>
        </NodeInfo>

        <Editor onSave={onSave} content={content} editorId={snippet.id} />
      </StyledEditor>
    </>
  )
}

export default SnippetEditor
