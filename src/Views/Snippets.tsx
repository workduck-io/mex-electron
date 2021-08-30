import { nanoid } from 'nanoid'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Editor from '../Editor/Editor'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { CreateSnippet, SnippetsWrapper, SSnippet, SSnippets } from '../Styled/Snippets'
import { Title } from '../Styled/Typography'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'

export type SnippetsProps = {
  title?: string
}

const Snippets: React.FC<SnippetsProps> = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const addSnippet = useSnippetStore((store) => store.addSnippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const history = useHistory()

  const onCreateNew = () => {
    // Create a better way.
    const newId = nanoid()
    addSnippet({
      id: newId,
      title: 'Untitled',
      content: [{ children: [{ text: '' }] }]
    })

    loadSnippet(newId)

    history.push('/snippets/editor')
  }

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    history.push('/snippets/editor')
  }

  return (
    <SnippetsWrapper>
      <Title>Snippets</Title>
      <SSnippets>
        <CreateSnippet onClick={onCreateNew}>
          <Icon icon={quillPenLine} height={100} />
          <p>Create New Snippet</p>
        </CreateSnippet>
        {snippets.map((s) => (
          <SSnippet
            key={`SnippetPreview_${s.id}`}
            onClick={() => {
              onOpenSnippet(s.id)
            }}
          >
            <h1>{s.title}</h1>
            <p>Use /snip.{s.title}</p>

            <Editor readOnly content={s.content} editorId={`Editor_Embed_${s.id}`} />
          </SSnippet>
        ))}
      </SSnippets>
    </SnippetsWrapper>
  )
}

export default Snippets
