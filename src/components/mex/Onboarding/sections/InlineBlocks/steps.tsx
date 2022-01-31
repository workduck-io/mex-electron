import React from 'react'
import { Command } from '../../../NodeIntentsModal/styled'
import { StyledTypography } from '../../components/welcome.style'
import { toolTipStyle } from '../../steps'
import { OnboardElements } from '../../types'

export const inlineBlockTour = [
  {
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
]
