import WelcomeSection, { StyledKeyCap, StyledTypography } from './components/Welcome'
import React from 'react'
import { Command } from '../NodeIntentsModal/styled'
import styled from 'styled-components'
import { CenteredFlex, PrimaryText } from '../../Styled/Integration'
import { Button } from '../../Styled/Buttons'
import useOnboard from './useOnboarding'
import { useFlowMessage } from './tourNode'
import { useHistory } from 'react-router-dom'

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

const FlowMessage = () => {
  const setFlowMessage = useOnboard((s) => s.setFlowMessage)
  const flowMessage = useOnboard((s) => s.flowMessage)

  const { addContent } = useFlowMessage()

  return (
    <>
      <div>Now let's send something back from your integrated service. Write the message you want to send to Mex.</div>
      <TextArea
        placeholder="Your content here..."
        className="syncTextArea"
        defaultValue={''}
        autoFocus={true}
        onChange={(ev) => setFlowMessage(ev.target.value)}
      />
      <CenteredFlex>
        <Button
          onClick={() => {
            addContent(flowMessage)
            performClick()
          }}
        >
          Send
        </Button>
      </CenteredFlex>
    </>
  )
}

const MoveToIntegrationpage = () => {
  const router = useHistory()

  return (
    <>
      <div>Now, why don't we show you how to create a flow block</div>
      <br />
      <CenteredFlex>
        <Button
          onClick={() => {
            router.push('/integrations')
            performClick()
          }}
        >
          Take me there
        </Button>
      </CenteredFlex>
    </>
  )
}

const FinishIntegration = () => {
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)

  const onClick = () => {
    changeOnboarding(false)
  }
  return (
    <>
      <div>Now, create a template for Flow block by clicking on + button</div>
      <br />
      <CenteredFlex>
        <Button onClick={onClick}>Finish Onboarding</Button>
      </CenteredFlex>
    </>
  )
}

const displayNone = (node) => {
  const nextBtn = document.getElementById('tour-next-button')
  if (nextBtn) nextBtn.style.display = 'none'
}

export const performClick = (showButton = true) => {
  const nextBtn = document.getElementById('tour-next-button')
  nextBtn?.click()
  if (showButton) nextBtn.style.display = 'inline-block'
}

export const OnboardingTourConfig = [
  {
    selector: '[data-tour="onboarding"]',
    content: () => <WelcomeSection />,
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: '[data-tour="mex-onboarding-draft-editor"]',
    content: (
      <>
        <div>You just got teleported to a draft node with your captured content!</div>
        <br />
        <div>Now, there are a host of things you can do from here</div>
        <ul>
          <li>
            Save this particular node to a (place of your choice) for easy discovery (Like my first Mex Date :eyes:)
          </li>
          <li>Reference this node in other nodes you create in future.</li>
          <li>Embed this node in other nodes</li>
        </ul>
        <br />
        <div>..... the possibilities are endless.</div>
        <br />
        <div>
          Let’s unearth the magic together by moving to another node.
          <br />
          <br />
          <CenteredFlex>
            <div>
              Press <StyledKeyCap>CMD + L</StyledKeyCap> and <PrimaryText>Lookup</PrimaryText> Tour node
            </div>
          </CenteredFlex>
        </div>
      </>
    ),
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: '[data-tour="mex-onboarding-ilink"]',
    content: (
      <>
        <div>
          Create backlinks using{' '}
          <Command>
            <strong> [[ </strong>
          </Command>
          command
        </div>
        <StyledTypography margin="0.5rem 0" size="0.8rem" color="#aaa" maxWidth="100%">
          Incase you want to link your thoughts together
        </StyledTypography>
      </>
    ),
    style: toolTipStyle
  },
  {
    selector: '[data-tour="mex-onboarding-inline-block"]',
    content: (
      <>
        <div>
          Create Inline blocks using
          <Command>
            <strong> ![[ </strong>
          </Command>{' '}
          command
        </div>
        <StyledTypography margin="0.5rem 0" size="0.9rem" color="#aaa" maxWidth="100%">
          Incase you wanna see stuff in a single place, make fancy dashboards, have a personal cron system - the
          possibilites are endless…
        </StyledTypography>
        <StyledTypography margin="1rem 0" size="0.9rem" color="#aaa" maxWidth="100%">
          [we love getting amazed by new use cases too 🙂]
        </StyledTypography>
      </>
    ),
    style: toolTipStyle
  },
  {
    selector: '[data-tour="mex-flow-block"]',
    content: (
      <>
        <div>
          Putting the flow in your workflows with{' '}
          <Command>
            <strong>/flow</strong>
          </Command>{' '}
        </div>
        <br />
        <div>Whatever you put here stays in sync across all integrated services.</div>
        <div>
          Let’s see how - here’s a pre-loaded flow block ‘Onboarding service’ Access it with{' '}
          <Command>
            <strong>/flow.onboard</strong>
          </Command>{' '}
          anywhere.
        </div>
        <br />
        <div>Type something to see the magic.</div>
      </>
    ),
    style: toolTipStyle,
    action: displayNone,
    stepInteraction: true
  },
  {
    selector: '[data-tour="mex-flow-block"]',
    content: <FlowMessage />,
    style: toolTipStyle,
    action: displayNone,
    stepInteraction: true
  },
  {
    selector: '[data-tour="mex-flow-block-response"]',
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
  }
]

export const SpotlightOnboarding = [
  {
    selector: '[data-tour="mex-quick-capture-preview"]',
    content: <div>Anything you capture would be visible here.</div>,
    style: toolTipStyle,
    position: 'right'
  },
  {
    selector: '[data-tour="mex-create-new-draft"]',
    content: (
      <div>
        Create new node by pressing <StyledKeyCap>TAB</StyledKeyCap>
      </div>
    ),
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: '[data-tour="mex-edit-content"]',
    content: (
      <>
        <div>Edit your captured content here and hit save.</div>
        <br />
        <div>
          Save captured content using <StyledKeyCap>CMD+S</StyledKeyCap>
        </div>
      </>
    ),
    style: toolTipStyle,
    action: displayNone
  }
]
