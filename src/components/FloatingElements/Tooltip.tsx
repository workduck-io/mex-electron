import React, { cloneElement, useMemo, useState } from 'react'
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss
} from '@floating-ui/react-dom-interactions'
import { mergeRefs } from 'react-merge-refs'
import { TooltipWrapper } from './Tooltip.style'

interface Props {
  label: JSX.Element | string
  placement?: Placement
  children: JSX.Element
  offsetPx?: number
}

/**
 * Generic Tooltip component
 *
 * Ref: https://codesandbox.io/s/winter-tree-wmmffl?file=/src/App.tsx
 */
export const Tooltip = ({ children, label, offsetPx = 5, placement = 'top' }: Props) => {
  const [open, setOpen] = useState(false)

  const { x, y, reference, floating, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useRole(context, { role: 'tooltip' }),
    useDismiss(context)
  ])

  // Preserve the consumer's ref
  const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [reference, children])

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      {open && (
        <TooltipWrapper
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0
          }}
          {...getFloatingProps()}
        >
          {label}
        </TooltipWrapper>
      )}
    </>
  )
}
