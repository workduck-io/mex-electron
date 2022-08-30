import React, { cloneElement, useState } from 'react'
import {
  offset,
  shift,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useId,
  useClick,
  FloatingFocusManager,
  FloatingPortal,
  useFloatingNodeId,
  FloatingNode,
  autoPlacement,
  autoUpdate,
  useHover
} from '@floating-ui/react-dom-interactions'
import { Props } from './types'

export const Floating = ({ children, hover, render, placement }: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  const nodeId = useFloatingNodeId()

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), autoPlacement(), shift()],
    placement,
    nodeId
    // whileElementsMounted: autoUpdate
  })

  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    hover && useHover(context, { restMs: 200, delay: { open: 200, close: 100 } }),
    useDismiss(context)
  ])

  return (
    <FloatingNode id={nodeId}>
      {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context}>
            <div
              {...getFloatingProps({
                className: 'Popover',
                ref: floating,
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0
                },
                'aria-labelledby': labelId,
                'aria-describedby': descriptionId
              })}
            >
              {render({
                labelId,
                descriptionId,
                close: () => {
                  setOpen(false)
                }
              })}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  )
}
