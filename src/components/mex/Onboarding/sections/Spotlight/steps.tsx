import React from 'react'
import { ReactourStep } from 'reactour'
import SpotlightFinishTour from '.'
import { toolTipStyle, displayNone } from '../../steps'
import { OnboardElements } from '../../types'

export const SpotlightOnboarding: Array<ReactourStep> = [
  {
    selector: `[data-tour="${OnboardElements.MEX_EDITOR}"]`,
    content: (
      <>
        <div>Anything you capture would be visible here.</div>
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
      </>
    ),
    style: toolTipStyle
  },
  {
    selector: '[data-tour="mex-quick-capture-search"]',
    content: <SpotlightFinishTour />,
    stepInteraction: true,
    position: 'center',
    style: toolTipStyle,
    action: displayNone
  }
]
