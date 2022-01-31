import { Button } from '@udecode/plate'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { USE_API } from '../../../../../data/Defaults/dev_'
import useLoad from '../../../../../hooks/useLoad'
import useDataStore from '../../../../../store/useDataStore'
import useOnboard from '../../../../../store/useOnboarding'
import { CenteredFlex } from '../../../../../style/Integration'
import { useOnboardingData } from '../../hooks'
import { TextArea, performClick } from '../../steps'
import { useFlowMessage } from '../../tourNode'

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
