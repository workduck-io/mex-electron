import React from 'react'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { SnippetsWrapper, SSnippets, SSnippet, CreateSnippet } from '../Styled/Snippets'
import { Title } from '../Styled/Typography'
import { nanoid } from 'nanoid'

import { useHistory } from 'react-router-dom'
export type SnippetsProps = {
  title?: string
}

const Snippets: React.FC<SnippetsProps> = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const addSnippet = useSnippetStore((store) => store.addSnippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const history = useHistory()

  const onCreateNew = () => {
    const newId = nanoid()
    addSnippet({
      id: newId,
      title: 'Untitled',
      content: [{ children: [{ text: '' }] }]
    })

    loadSnippet(newId)

    history.push('/snippets/editor')
  }

  return (
    <SnippetsWrapper>
      <Title>Snippets</Title>
      <SSnippets>
        <CreateSnippet onClick={onCreateNew}>Create New Snippet</CreateSnippet>
        {snippets.map((s) => (
          <SSnippet key={`SnippetPreview_${s.id}`}>
            {s.id}

            {JSON.stringify(s.content)}
          </SSnippet>
        ))}
      </SSnippets>
    </SnippetsWrapper>
  )
}

export default Snippets
