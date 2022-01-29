import { Button } from '@udecode/plate'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Command } from '../../../../../components/mex/NodeIntentsModal/styled'
import { StyledTypography } from '../../components/welcome.style'

const SnippetTour = () => {
  const history = useHistory()
  const location = useLocation()

  const onClick = () => {
    if (location.pathname !== '/snippets') history.push('/snippets')
  }

  return (
    <>
      <StyledTypography margin="0.5rem 0" size="0.9rem" color="#aaa" maxWidth="100%">
        This is a snippet section. For now, we&apos;ve created a PRD snippet for you.
      </StyledTypography>
      <div>
        To insert this node into your document, Use
        <Command>
          <strong> / </strong>
        </Command>{' '}
        with your snippet name anywhere in editor. It&apos;ll insert your snippet into the editor.
      </div>
      <br />
      <Button onClick={onClick}>Used Snippet</Button>
    </>
  )
}

export default SnippetTour
