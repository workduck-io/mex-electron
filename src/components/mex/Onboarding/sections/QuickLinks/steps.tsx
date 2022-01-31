import React from 'react'
import { QuickLinkTour, FinishQuickLink } from '.'
import { displayNone, toolTipStyle } from '../../steps'
import { OnboardElements } from '../../types'

export const quickLinkTour = [
  {
    selector: `[data-tour="${OnboardElements.QUICK_LINK}"]`,
    content: <QuickLinkTour />,
    style: toolTipStyle,
    action: displayNone,
    stepInteraction: true
  },
  {
    selector: `[data-tour="${OnboardElements.MEX_EDITOR}"]`,
    content: <div>Now, let&apos;s try to make a quick link of Product Tour in doc</div>,
    stepInteraction: true,
    style: toolTipStyle
  },
  {
    selector: `[data-tour="${OnboardElements.QUICK_LINK_LIST}"]`,
    content: <FinishQuickLink />,
    action: displayNone,
    style: toolTipStyle
  }
]
