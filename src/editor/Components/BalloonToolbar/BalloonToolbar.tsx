import { withPlateProvider } from '@udecode/plate-core'
import { PortalBody } from '@udecode/plate-styled-components'
import { UseVirtualFloatingOptions } from '@udecode/plate-floating'
import React, { useRef } from 'react'
// import { ToolbarBase } from '../Toolbar/Toolbar'
import { BalloonToolbarBase, getBalloonToolbarStyles } from './BalloonToolbar.styles'
import { BalloonToolbarProps } from './BalloonToolbar.types'
import { useBalloonToolbarPopper } from './useBalloonToolbarPopper'

export const BalloonToolbar = withPlateProvider((props: BalloonToolbarProps) => {
  const { children, theme = 'dark', arrow = false, portalElement, popperOptions: _popperOptions = {} } = props

  const floatingRef = useRef<HTMLDivElement>(null)

  const popperOptions: UseVirtualFloatingOptions = {
    popperElement: floatingRef.current,
    placement: 'top' as any,
    offset: [0, 8],
    ..._popperOptions
  }

  const { styles: popperStyles, attributes } = useBalloonToolbarPopper(popperOptions)

  const styles = getBalloonToolbarStyles({
    popperOptions,
    theme,
    arrow,
    ...props
  })

  return (
    <PortalBody element={portalElement}>
      <BalloonToolbarBase
        ref={floatingRef}
        className={styles.root.className}
        style={popperStyles.popper}
        popperOptions={popperOptions}
        {...attributes.popper}
      >
        {children}
      </BalloonToolbarBase>
    </PortalBody>
  )
})
