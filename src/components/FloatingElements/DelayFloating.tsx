import React, { cloneElement, useState } from 'react'
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
  useDismiss,
  useDelayGroupContext,
  useDelayGroup
} from '@floating-ui/react-dom-interactions'

interface Props {
  label: string
  placement?: Placement
  children: JSX.Element
}

export const Tooltip = ({ children, label, placement = 'top' }: Props) => {
  const { delay, setCurrentId } = useDelayGroupContext()
  const [open, setOpen] = useState(false)

  const { x, y, reference, floating, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange(open) {
      setOpen(open)

      if (open) {
        setCurrentId(label)
      }
    },
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { delay, restMs: 600 }),
    useFocus(context),
    useRole(context, { role: 'tooltip' }),
    useDismiss(context),
    useDelayGroup(context, { id: label })
  ])

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
      {open && (
        <div
          ref={floating}
          className="Tooltip"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0
          }}
          {...getFloatingProps()}
        >
          {label}
        </div>
      )}
    </>
  )
}
