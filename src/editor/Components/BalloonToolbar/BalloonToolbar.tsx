import React, { useRef } from 'react'
import { withEditor } from '@udecode/plate-core'
import { PortalBody } from '@udecode/plate-styled-components'
import { UsePopperPositionOptions } from '@udecode/plate-ui-popper'
import { BalloonToolbarBase, getBalloonToolbarStyles } from './BalloonToolbar.styles'
import { BalloonToolbarProps } from './BalloonToolbar.types'
import { useBalloonToolbarPopper } from './useBalloonToolbarPopper'
// import { ToolbarBase } from '@udecode/plate'
import { mog } from '../../../utils/lib/helper'

export const BalloonToolbar = withEditor((props: BalloonToolbarProps) => {
  const { children, theme = 'dark', arrow = false, portalElement, popperOptions: _popperOptions = {} } = props

  const popperRef = useRef<HTMLDivElement>(null)

  const popperOptions: UsePopperPositionOptions = {
    popperElement: popperRef.current,
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

  // mog('Balloon', { styles, popperOptions })

  return (
    <PortalBody element={portalElement}>
      <BalloonToolbarBase
        ref={popperRef}
        css={styles.root.css}
        className={styles.root.className}
        style={popperStyles.popper}
        {...attributes.popper}
      >
        {children}
      </BalloonToolbarBase>
    </PortalBody>
  )
})
