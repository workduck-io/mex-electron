import React from 'react'
import { withPlateEventProvider } from '@udecode/plate-core'
import { PortalBody } from '@udecode/plate-styled-components'
import { getBalloonToolbarStyles, BalloonToolbarBase } from './BalloonToolbar.styles'
import { BalloonToolbarProps } from './BalloonToolbar.types'
import { useFloatingToolbar } from './useBalloonToolbarPopper'

export const BalloonToolbar = withPlateEventProvider((props: BalloonToolbarProps) => {
  const { children, theme = 'dark', arrow = false, portalElement, floatingOptions } = props

  const { floating, style, placement, open } = useFloatingToolbar({
    floatingOptions
  })

  const styles = getBalloonToolbarStyles({
    placement,
    theme,
    arrow,
    ...props
  })

  if (!open) return null

  return (
    <PortalBody element={portalElement}>
      <BalloonToolbarBase css={styles.root.css} className={styles.root.className} ref={floating} style={style}>
        {children}
      </BalloonToolbarBase>
    </PortalBody>
  )
})
