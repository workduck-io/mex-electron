import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SnippetSaverButton } from '../../editor/Components/Saver'
import Editor from '../../editor/Editor'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../../style/Editor'
import { Input } from '../../style/Form'
import { useSnippetStore } from '../../store/useSnippetStore'
import { useUpdater } from '../../hooks/useUpdater'

type Inputs = {
  title: string
}

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)

  const {
    register,
    getValues,
    formState: { errors }
  } = useForm<Inputs>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  const { updater } = useUpdater()

  useEffect(() => {
    if (snippet) {
      setContent(snippet.content)
    }
  }, [snippet])

  const updateSnippet = useSnippetStore((state) => state.updateSnippet)

  const getSnippetTitle = () => getValues().title

  const onChangeSave = (val: any[]) => {
    if (val) {
      updateSnippet(snippet.id, { ...snippet, content: val })
      updater()
    }
  }

  return (
    <>
      <StyledEditor className="snippets_editor">
        <NodeInfo>
          <NoteTitle>
            /snip. <Input defaultValue={snippet && snippet.title} {...register('title')} />
          </NoteTitle>

          <InfoTools>
            <SnippetSaverButton getSnippetTitle={getSnippetTitle} title="Save Snippet" />
          </InfoTools>
        </NodeInfo>

        <Editor onChange={onChangeSave} content={content} editorId={snippet.id} />
      </StyledEditor>
    </>
  )
}

export default SnippetEditor
