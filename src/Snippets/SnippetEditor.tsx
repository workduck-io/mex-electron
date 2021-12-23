import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SnippetSaverButton } from '../Editor/Components/Saver'
import Editor from '../Editor/Editor'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor'
import { Input } from '../Styled/Form'

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

  useEffect(() => {
    if (snippet) {
      setContent(snippet.content)
    }
  }, [snippet])

  const getSnippetTitle = () => getValues().title

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

        <Editor content={content} editorId={snippet.id} />
      </StyledEditor>
    </>
  )
}

export default SnippetEditor
