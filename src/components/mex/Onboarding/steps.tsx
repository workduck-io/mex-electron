import styled, { useTheme } from 'styled-components'
import { snippetTour } from './sections/Snippets/steps'
import { inlineBlockTour } from './sections/InlineBlocks/steps'
import React from 'react'
import { OnboardElements } from './types'
import { FinishQuickLink, QuickLinkTour } from './sections/QuickLinks'
import SnippetTour, { FinishSnippetTour } from './sections/Snippets'
import { Command } from '../NodeIntentsModal/styled'
import FlowMessage, { MoveToIntegrationpage, FinishIntegration } from './sections/FlowLinks'
import { PrimaryText } from '../../../style/Integration'
import WelcomeSection from './components/Welcome'
import { useHistory } from 'react-router-dom'
import { Button } from '../../../style/Buttons'
import { WelcomeHeader, StyledTypography } from './components/welcome.style'

export const toolTipStyle = {
  padding: '2rem',
  color: '#ccc',
  background: '#282828'
}

export const TextArea = styled.textarea`
  background-color: #333;
  border: none;
  border-radius: 0.5rem;
  color: #b9b9b9;
  width: 100%;
  height: 100px;
  margin: 1rem 0;
  padding: 1rem;
`

export const action = (node) => {
  const nextBtn = document.getElementById('tour-next-button')
  if (nextBtn) nextBtn.style.display = 'none'
  if (node) {
    node.onclick = () => {
      nextBtn.style.display = 'inline-block'
      nextBtn?.click()
    }
  }
}

export const displayNone = (node) => {
  const nextBtn = document.getElementById('tour-next-button')
  if (nextBtn) nextBtn.style.display = 'none'
}

export const performClick = (showButton = true) => {
  const nextBtn = document.getElementById('tour-next-button')
  nextBtn?.click()
  if (showButton) nextBtn.style.display = 'inline-block'
}

const BookmarkTour = () => {
  const history = useHistory()

  const onClick = () => {
    history.push('/snippets')
    performClick()
  }
  return (
    <>
      <div>If you use a document frequently, bookmark it and those would be visible here</div>
      <Button onClick={onClick}>Go to</Button>
    </>
  )
}

const FlowLinkTour = () => {
  const theme = useTheme()
  return (
    <>
      <WelcomeHeader>
        <StyledTypography size="2rem" color={theme.colors.primary} margin="0" maxWidth="100%">
          Quick Links
        </StyledTypography>
      </WelcomeHeader>
      <br />
      <br />
      <div>
        Putting the flow in your workflows with{' '}
        <Command>
          <strong>/flow</strong>
        </Command>{' '}
      </div>
      <br />
      <div>Whatever you put here stays in sync across all integrated services.</div>
    </>
  )
}

export const OnboardingTourConfig = [
  {
    selector: `[data-tour="${OnboardElements.QUICK_LINK}"]`,
    content: <QuickLinkTour />,
    style: toolTipStyle,
    action: displayNone,
    stepInteraction: true
  },
  {
    selector: `[data-tour="${OnboardElements.MEX_EDITOR}"]`,
    content: (
      <div>
        Now, let&apos;s say you want link your <PrimaryText>&quot;Quick Links&quot;</PrimaryText> node here.
        <div>
          You can do it by typing <Command>[[Tour.Quick Links]]</Command> command anywhere in the editor.
        </div>
        <br />
        <div>Give it a try!!</div>
      </div>
    ),
    stepInteraction: true,
    style: toolTipStyle
  },
  {
    selector: `[data-tour="${OnboardElements.QUICK_LINK_LIST}"]`,
    content: <FinishQuickLink />,
    action: displayNone,
    style: toolTipStyle
  },
  // * Snippet tour
  {
    selector: `[data-tour="${OnboardElements.MEX_EDITOR}"]`,
    content: <SnippetTour />,
    style: toolTipStyle
  },
  {
    selector: `[data-tour="wd-mex-bookmark"]`,
    content: <BookmarkTour />,
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: `[data-tour="${OnboardElements.SNIPPET}"]`,
    content: <FinishSnippetTour />,
    style: toolTipStyle,
    action: displayNone
  },
  //* Flow links tour
  {
    selector: `[data-tour="${OnboardElements.MEX_EDITOR}"]`,
    content: <FlowLinkTour />,
    style: toolTipStyle
  },
  {
    selector: `[data-tour="${OnboardElements.FLOW_LINK}"]`,
    content: (
      <>
        <div>
          Let&apos;s say you want to send a message <PrimaryText>&quot;Hey what&apos;s up ?&quot;</PrimaryText> to
          slack. You&apos;ll create a Flow link of slack, and type your message there and send it.
        </div>
        <br />
        <div>Just like we did here</div>
      </>
    ),
    style: toolTipStyle
  },
  {
    selector: `[data-tour="${OnboardElements.FLOW_LINK_RESPONSE}"]`,
    content: <FlowMessage />,
    style: toolTipStyle,
    action: displayNone,
    stepInteraction: true
  },
  {
    selector: `[data-tour="${OnboardElements.FLOW_LINK_RESPONSE}"]`,
    content: <MoveToIntegrationpage />,
    style: toolTipStyle,
    action: displayNone,
    stepInteraction: true
  },
  {
    selector: '[data-tour="service-connect"]',
    content: <div>To use Flow blocks, first connect with service.</div>,
    style: toolTipStyle
  },
  {
    selector: '[data-tour="create-flow-template"]',
    content: <FinishIntegration />,
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: '[data-tour="onboarding"]',
    content: () => <WelcomeSection />,
    style: toolTipStyle,
    action: displayNone
  }
]
