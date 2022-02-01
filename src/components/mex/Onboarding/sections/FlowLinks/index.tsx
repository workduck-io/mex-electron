import React from 'react'
import { useHistory } from 'react-router-dom'
import { Command } from '../../../NodeIntentsModal/styled'
import { useTheme } from 'styled-components'
import { USE_API } from '../../../../../data/Defaults/dev_'
import useLoad from '../../../../../hooks/useLoad'
import useDataStore from '../../../../../store/useDataStore'
import useOnboard from '../../../../../store/useOnboarding'
import { CenteredFlex } from '../../../../../style/Integration'
import { WelcomeHeader, StyledTypography } from '../../components/welcome.style'
import { useOnboardingData } from '../../hooks'
import { performClick, TextArea } from '../../steps'
import { useFlowMessage } from '../../tourNode'
import { Button } from '../../../../../style/Buttons'

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

export const FlowLinkTour = () => {
  const theme = useTheme()
  return (
    <>
      <WelcomeHeader>
        <StyledTypography size="2rem" color={theme.colors.primary} margin="0" maxWidth="100%">
          Flow Links
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

export const MoveToIntegrationpage = () => {
  const router = useHistory()
  const ilinks = useDataStore((s) => s.ilinks)

  const { loadNode } = useLoad()

  return (
    <>
      <div>Now, why don&apos;t we show you how to create a flow block</div>
      <br />
      <CenteredFlex>
        <Button
          onClick={() => {
            if (ilinks.length > 0) loadNode(ilinks[0].nodeid, { savePrev: false, fetch: USE_API() })
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

export const FinishIntegration = () => {
  const { closeOnboarding } = useOnboardingData()

  const onClick = () => {
    closeOnboarding()
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

export default FlowMessage
