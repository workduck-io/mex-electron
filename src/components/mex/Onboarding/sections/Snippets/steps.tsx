import React from 'react'
import { Command } from '../../../NodeIntentsModal/styled'
import SnippetTour from '.'
import { toolTipStyle, displayNone } from '../../steps'
import { OnboardElements } from '../../types'
import { FinishQuickLink } from '../QuickLinks'

export const snippetTour = [
  {
    selector: `[data-tour="${OnboardElements.SNIPPET}"]`,
    content: <SnippetTour />,
    style: toolTipStyle,
    action: displayNone
  },
  {
    selector: `[data-tour="${OnboardElements.MEX_EDITOR}"]`,
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
