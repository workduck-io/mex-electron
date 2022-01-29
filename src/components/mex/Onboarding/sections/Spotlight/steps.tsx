import React from 'react'
import { ReactourStep } from 'reactour'
import { StyledKeyCap } from '../../components/welcome.style'
import { displayNone, toolTipStyle } from '../../steps'

export const SpotlightOnboarding: Array<ReactourStep> = [
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
