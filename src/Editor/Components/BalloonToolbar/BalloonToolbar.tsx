import * as React from 'react'
import { useEventEditorId, useStoreEditorState } from '@udecode/plate-core'
import { PortalBody } from '@udecode/plate-styled-components'
import { StyledToolbarBase } from './BalloonToolbar.styles'
import { BalloonToolbarProps } from './BalloonToolbar.types'
import { useBalloonMove } from './useBalloonMove'
import { useBalloonShow } from './useBalloonShow'

export const BalloonToolbar = (props: BalloonToolbarProps) => {
  const { children, hiddenDelay = 0, direction = 'top', theme = 'dark', arrow = false } = props

  const ref = React.useRef<HTMLDivElement>(null)
  const editor = useStoreEditorState(useEventEditorId('focus'))

  const [hidden] = useBalloonShow({ editor, ref, hiddenDelay })
  useBalloonMove({ editor, ref, direction })

  return (
    <PortalBody>
      <StyledToolbarBase ref={ref} hidden={hidden} arrow={arrow} className="BalloonToolbar">
        {children}
      </StyledToolbarBase>
    </PortalBody>
  )
}
