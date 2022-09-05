import addCircleLine from '@iconify/icons-ri/add-circle-line'
import React, { cloneElement, useMemo, useState } from 'react'
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useId,
  useClick,
  FloatingFocusManager
} from '@floating-ui/react-dom-interactions'
import { mergeRefs } from 'react-merge-refs'
import { useCreateNewMenu } from '@hooks/useCreateNewMenu'
import { Icon } from '@iconify/react'
import { CreateNewMenuItemWrapper, CreateNewMenuWrapper } from './Sidebar.style'

interface Props {
  placement?: Placement
  children: JSX.Element
}

/*
 * TODO
 * - [ ] Add keyboard navigation
 * - [ ] Use dynamic nested menus
 */

/**
 * Create New Menu, uses CreateNewMenu hook to get the create new menu
 */
export const CreateNewMenu = ({ children, placement }: Props) => {
  const [open, setOpen] = useState(false)

  const { getCreateNewMenuItems } = useCreateNewMenu()

  const menuItems = getCreateNewMenuItems('randomPath')

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift()],
    placement,
    whileElementsMounted: autoUpdate
  })

  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context)
  ])

  // Preserve the consumer's ref
  const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [reference, children])

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      {open && (
        <FloatingFocusManager context={context} modal={false} order={['reference', 'content']} returnFocus={false}>
          <CreateNewMenuWrapper
            ref={floating}
            className="Popover"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0
            }}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            {...getFloatingProps()}
          >
            {menuItems.map((i) => (
              <CreateNewMenuItemWrapper onClick={() => i.onSelect()} key={`create_new_${i.id}`}>
                <Icon icon={i.icon ?? addCircleLine} />
                {i.label}
              </CreateNewMenuItemWrapper>
            ))}
          </CreateNewMenuWrapper>
        </FloatingFocusManager>
      )}
    </>
  )
}