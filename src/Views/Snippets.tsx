import React from 'react'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { SnippetsWrapper, SSnippets, SSnippet, CreateSnippet } from '../Styled/Snippets'
import { Title } from '../Styled/Typography'

export type SnippetsProps = {
  title?: string
}

const Snippets: React.FC<SnippetsProps> = () => {
  const snippets = useSnippetStore((store) => store.snippets)

  return (
    <SnippetsWrapper>
      <Title>Snippets</Title>
      <SSnippets>
        <CreateSnippet>Create New Snippet</CreateSnippet>
        {snippets.map((s) => (
          <SSnippet key={`SnippetPreview_${s.id}`}>{s.id}</SSnippet>
        ))}
      </SSnippets>
    </SnippetsWrapper>
  )
}

export default Snippets
