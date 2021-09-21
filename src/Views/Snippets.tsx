import { nanoid } from 'nanoid'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Editor from '../Editor/Editor'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import {
  CreateSnippet,
  SnippetCommand,
  SnippetCommandPrefix,
  SnippetHeader,
  SSnippet,
  SSnippets,
  StyledSnippetPreview
} from '../Styled/Snippets'
import { Title } from '../Styled/Typography'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import IconButton from '../Styled/Buttons'
import { Wrapper } from '../Styled/Layouts'

export type SnippetsProps = {
  title?: string
}

const Snippets: React.FC<SnippetsProps> = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const addSnippet = useSnippetStore((store) => store.addSnippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const deleteSnippet = useSnippetStore((store) => store.deleteSnippet)

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

  const onDeleteSnippet = (id: string) => {
    deleteSnippet(id)
  }

  return (
    <Wrapper>
      <Title>Snippets</Title>
      <SSnippets>
        <CreateSnippet onClick={onCreateNew}>
          <Icon icon={quillPenLine} height={100} />
          <p>Create New Snippet</p>
        </CreateSnippet>
        {snippets.map((s) => (
          <SSnippet key={`SnippetPreview_${s.id}`}>
            <SnippetHeader>
              <SnippetCommand onClick={() => onOpenSnippet(s.id)}>
                <SnippetCommandPrefix>/snip.</SnippetCommandPrefix>
                {s.title}
              </SnippetCommand>

              <IconButton size={20} icon={deleteBin6Line} title="delete" onClick={() => onDeleteSnippet(s.id)} />
            </SnippetHeader>

            <StyledSnippetPreview
              onClick={() => {
                onOpenSnippet(s.id)
              }}
            >
              <Editor readOnly content={s.content} editorId={`Editor_Embed_${s.id}`} />
            </StyledSnippetPreview>
          </SSnippet>
        ))}
      </SSnippets>
    </Wrapper>
  )
}

export default Snippets
