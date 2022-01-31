import { Button } from '@udecode/plate'
import React from 'react'
import { FlexBetween } from '../../../../../components/spotlight/Actions/styled'
import { useTheme } from 'styled-components'
import { Command } from '../../../../../components/mex/NodeIntentsModal/styled'
import { StyledTypography, WelcomeHeader } from '../../components/welcome.style'
import { useOnboardingData } from '../../hooks'
import { performClick } from '../../steps'
import { PrimaryText } from '../../../../../style/Integration'
import { useLinks } from '../../../../../hooks/useLinks'
import useLoad from '../../../../../hooks/useLoad'
import { useHistory, useLocation } from 'react-router-dom'

const SnippetTour = () => {
  const theme = useTheme()

  return (
    <>
      <WelcomeHeader>
        <StyledTypography size="2rem" color={theme.colors.primary} margin="0" maxWidth="100%">
          Snippets
        </StyledTypography>
      </WelcomeHeader>
      <StyledTypography margin="0.5rem 0" size="0.9rem" color="#aaa" maxWidth="100%"></StyledTypography>
      <br />
      <div>
        This is a Name PRD which is created using <PrimaryText>Snippets</PrimaryText>
      </div>
      <div>
        To insert a snippet into your document, type
        <Command>
          <strong> / </strong>
        </Command>{' '}
        with your snippet name anywhere in editor. It&apos;ll insert your snippet into the editor.
      </div>
    </>
  )
}

export const FinishSnippetTour = () => {
  const { closeOnboarding } = useOnboardingData()
  const { getUidFromNodeId } = useLinks()
  const { loadNode } = useLoad()
  const history = useHistory()
  const location = useLocation()

  const onClick = () => {
    const uid = getUidFromNodeId('Tour.Flow Links')
    loadNode(uid, { fetch: false, savePrev: false })
    if (location.pathname !== '/editor') history.replace('/editor')
    performClick()
  }

  return (
    <>
      <>
        <div> This is a snippet section. This is the PRD snippet that we were using in that document.</div>
        <br />
        <div>
          To use any snippet, use
          <Command>
            <strong> / </strong>
          </Command>{' '}
          and snippet name in the editor
        </div>
      </>
      <FlexBetween>
        <Button onClick={closeOnboarding}>Finish</Button>
        <Button onClick={onClick}>
          Next <PrimaryText>&quot;Flow Links&quot;</PrimaryText>
        </Button>
      </FlexBetween>
    </>
  )
}

export default SnippetTour
