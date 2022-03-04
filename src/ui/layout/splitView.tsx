import React, { useEffect, useMemo, useRef } from 'react'
import { useSpring } from 'react-spring'
import { mog } from '../../utils/lib/helper'
import { SplitPreviewWrapper, SplitWrapper } from './splitView.style'

export enum SplitType {
  FULL = 'FULL',
  SIDE = 'SIDE',
  NONE = 'NONE'
}

export interface SplitOptions {
  type: SplitType
  // TODO: Implement when necessary
  // side?: 'left' | 'right'
  /** percentage for preview */
  percent?: number
}

export interface RenderSplitProps {
  splitOptions: SplitOptions
}
export interface SplitViewProps {
  children: React.ReactNode
  // Show Preview
  splitOptions: SplitOptions
  // Render Sidebar
  // RenderSidebar: (props: RenderSplitProps) => JSX.Element
  // Render Preview
  RenderSplitPreview: (props: RenderSplitProps) => JSX.Element
}

const SplitView = ({ RenderSplitPreview, children, splitOptions }: SplitViewProps) => {
  mog('Split View', { splitOptions })
  // * Custom hooks
  const ref = useRef<HTMLDivElement>()

  const springProps = useMemo(() => {
    const style = { width: '0%' }

    if (splitOptions.type === SplitType.FULL) {
      style.width = '100%'
    } else if (splitOptions.type === SplitType.SIDE) {
      style.width = `${splitOptions.percent ?? 40}%`
    } else if (splitOptions.type === SplitType.NONE) {
      style.width = '0%'
    }

    return style
  }, [splitOptions])

  const animationProps = useSpring(springProps)

  return (
    <SplitWrapper>
      {children}
      <SplitPreviewWrapper style={animationProps} ref={ref}>
        <RenderSplitPreview splitOptions={splitOptions} />
      </SplitPreviewWrapper>
    </SplitWrapper>
  )
}

export default SplitView
