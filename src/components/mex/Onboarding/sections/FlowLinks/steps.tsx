import React from 'react'
import FlowMessage, { FinishIntegration, MoveToIntegrationpage } from '.'
import { Command } from '../../../NodeIntentsModal/styled'
import { toolTipStyle, displayNone } from '../../steps'

export const flowLinkMessage = [
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
    selector: '[data-tour="mex-flow-link"]',
    content: <FlowMessage />,
    style: toolTipStyle,
    action: displayNone,
    stepInteraction: true
  },
  {
    selector: '[data-tour="mex-flow-link-response"]',
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
