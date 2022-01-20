import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useUpdater } from '../../hooks/useUpdater'
import { generateSnippetId } from '../../data/Defaults/idPrefixes'
import Editor from '../../editor/Editor'
import { useSnippetStore } from '../../store/useSnippetStore'
import IconButton from '../../style/Buttons'
import { Wrapper } from '../../style/Layouts'
import {
  CreateSnippet,
  SnippetCommand,
  SnippetCommandPrefix,
  SnippetHeader,
  SSnippet,
  SSnippets,
  StyledSnippetPreview
} from '../../style/Snippets'
import { Title } from '../../style/Typography'
import genereateName from 'project-name-generator'

export type SnippetsProps = {
  title?: string
}

const Snippets: React.FC<SnippetsProps> = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const addSnippet = useSnippetStore((store) => store.addSnippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const deleteSnippet = useSnippetStore((store) => store.deleteSnippet)

  const history = useHistory()
  const { updater } = useUpdater()

  const onCreateNew = () => {
    // Create a better way.
    const snippetId = generateSnippetId()
    addSnippet({
      id: snippetId,
      title: genereateName().dashed,
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

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
