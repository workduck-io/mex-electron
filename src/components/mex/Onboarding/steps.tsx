import { StyledTypography } from './components/welcome.style'
import React from 'react'
import { Command } from '../NodeIntentsModal/styled'
import styled from 'styled-components'
import { useFlowMessage } from './tourNode'
import { useHistory } from 'react-router-dom'
import { CenteredFlex } from '../../../style/Integration'
import { Button } from '../../../style/Buttons'
import useOnboard from '../../../store/useOnboarding'
import { OnboardElements } from './types'
import QuickLinkTour from './sections/QuickLinks'
import SnippetTour from './sections/Snippets'
import { useOnboardingData } from './hooks'

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
      <div>
        Now let&apos;s send something back from your integrated service. Write the message you want to send to Mex.
      </div>
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
      <div>Now, why don&apos;t we show you how to create a flow block</div>
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

export const displayNone = (node) => {
  const nextBtn = document.getElementById('tour-next-button')
  if (nextBtn) nextBtn.style.display = 'none'
}

export const performClick = (showButton = true) => {
  const nextBtn = document.getElementById('tour-next-button')
  nextBtn?.click()
  if (showButton) nextBtn.style.display = 'inline-block'
}

export const FinishQuickLink = () => {
  const history = useHistory()

  const { closeOnboarding } = useOnboardingData()

  const onClick = () => {
    history.push('/snippets')
    performClick()
  }

  return (
    <>
      <div>This is a quick link section. Here you&apos;ll see all othere nodes where this node is referenced.</div>
      <br />
      <br />
      <CenteredFlex>
        <Button onClick={closeOnboarding}>Finish</Button>
        <Button onClick={onClick}>Continue</Button>
      </CenteredFlex>
    </>
  )
}

export const quickLinkTour = [
  {
    selector: `[data-tour="${OnboardElements.QUICK_LINK}"]`,
    content: <QuickLinkTour />,
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: '[data-tour="mex-onboarding-draft-editor"]',
    content: <div>Now, let&apos;s try to make a quick link of Product Tour in doc</div>,
    style: toolTipStyle,
    stepInteraction: true
  },
  {
    selector: `[data-tour="${OnboardElements.QUICK_LINK_LIST}"]`,
    content: <FinishQuickLink />,
    style: toolTipStyle,
    action: displayNone
  }
]

export const snippetTour = [
  {
    selector: `[data-tour="${OnboardElements.SNIPPET}"]`,
    content: <SnippetTour />,
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: '[data-tour="mex-onboarding-draft-editor"]',
    content: (
      <>
        <div>Now, let&apos;s try to use the created snippet inside doc node</div>
        <br />
        <div>
          Write{' '}
          <Command>
            <strong> /PRD </strong>
          </Command>{' '}
          and hit enter to insert PRD.
        </div>
      </>
    ),
    style: toolTipStyle,
    stepInteraction: true
  },
  {
    selector: `[data-tour="${OnboardElements.QUICK_LINK_LIST}"]`,
    content: <FinishQuickLink />,
    style: toolTipStyle,
    action: displayNone
  }
]

export const inlineBlockTour = {
  selector: `[data-tour="${OnboardElements.INLINE_BLOCK}"]`,
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
}

export const OnboardingTourConfig = [...quickLinkTour, ...snippetTour, inlineBlockTour]

// export const OnboardingTourConfig = [
//   {
//     selector: '[data-tour="onboarding"]',
//     content: () => <WelcomeSection />,
//     style: toolTipStyle,
//     action: displayNone
//   },
//   {
//     selector: '[data-tour="mex-onboarding-draft-editor"]',
//     content: (
//       <>
//         <div>You just got teleported to a draft node with your captured content!</div>
//         <br />
//         <div>Now, there are a host of things you can do from here</div>
//         <ul>
//           <li>
//             Save this particular node to a (place of your choice) for easy discovery (Like my first Mex Date :eyes:)
//           </li>
//           <li>Reference this node in other nodes you create in future.</li>
//           <li>Embed this node in other nodes</li>
//         </ul>
//         <br />
//         <div>..... the possibilities are endless.</div>
//         <br />
//         <div>
//           Let’s unearth the magic together by moving to another node.
//           <br />
//           <br />
//           <CenteredFlex>
//             <div>
//               Press <StyledKeyCap>CMD + L</StyledKeyCap> and <PrimaryText>Lookup</PrimaryText> Tour node
//             </div>
//           </CenteredFlex>
//         </div>
//       </>
//     ),
//     style: toolTipStyle,
//     action: displayNone
//   },
//   {
//     selector: '[data-tour="mex-onboarding-quick-link"]',
//     content: (
//       <>
//         <div>
//           Create backlinks using{' '}
//           <Command>
//             <strong> [[ </strong>
//           </Command>
//           command
//         </div>
//         <StyledTypography margin="0.5rem 0" size="0.8rem" color="#aaa" maxWidth="100%">
//           Incase you want to link your thoughts together
//         </StyledTypography>
//       </>
//     ),
//     style: toolTipStyle
//   },
//   {
//     selector: '[data-tour="mex-onboarding-inline-block"]',
//     content: (
//       <>
//         <div>
//           Create Inline blocks using
//           <Command>
//             <strong> ![[ </strong>
//           </Command>{' '}
//           command
//         </div>
//         <StyledTypography margin="0.5rem 0" size="0.9rem" color="#aaa" maxWidth="100%">
//           Incase you wanna see stuff in a single place, make fancy dashboards, have a personal cron system - the
//           possibilites are endless…
//         </StyledTypography>
//         <StyledTypography margin="1rem 0" size="0.9rem" color="#aaa" maxWidth="100%">
//           [we love getting amazed by new use cases too 🙂]
//         </StyledTypography>
//       </>
//     ),
//     style: toolTipStyle
//   },
//   {
//     selector: '[data-tour="mex-flow-block"]',
//     content: (
//       <>
//         <div>
//           Putting the flow in your workflows with{' '}
//           <Command>
//             <strong>/flow</strong>
//           </Command>{' '}
//         </div>
//         <br />
//         <div>Whatever you put here stays in sync across all integrated services.</div>
//         <div>
//           Let’s see how - here’s a pre-loaded flow block ‘Onboarding service’ Access it with{' '}
//           <Command>
//             <strong>/flow.onboard</strong>
//           </Command>{' '}
//           anywhere.
//         </div>
//         <br />
//         <div>Type something to see the magic.</div>
//       </>
//     ),
//     style: toolTipStyle,
//     action: displayNone,
//     stepInteraction: true
//   },
//   {
//     selector: '[data-tour="mex-flow-link"]',
//     content: <FlowMessage />,
//     style: toolTipStyle,
//     action: displayNone,
//     stepInteraction: true
//   },
//   {
//     selector: '[data-tour="mex-flow-link-response"]',
//     content: <MoveToIntegrationpage />,
//     style: toolTipStyle,
//     action: displayNone,
//     stepInteraction: true
//   },
//   {
//     selector: '[data-tour="service-connect"]',
//     content: <div>To use Flow blocks, first connect with service.</div>,
//     style: toolTipStyle
//   },
//   {
//     selector: '[data-tour="create-flow-template"]',
//     content: <FinishIntegration />,
//     style: toolTipStyle,
//     action: displayNone
//   }
// ]
