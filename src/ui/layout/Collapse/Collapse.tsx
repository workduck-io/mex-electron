import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import { Icon, IconifyIcon } from '@iconify/react'
import React, { useMemo } from 'react'
import { useSpring } from 'react-spring'
import styled from 'styled-components'
import {
  CollapseContent,
  CollapsableHeaderTitle,
  CollapseHeader,
  CollapseToggle,
  CollapseWrapper
} from './Collapse.style'
import { Infobox, InfoboxProps } from '@workduck-io/mex-components'
import { ManagedOpenState } from '@ui/sidebar/Sidebar.types'

interface CollapseProps {
  oid?: string
  defaultOpen?: boolean
  title: string
  maximumHeight?: string
  icon?: string | IconifyIcon
  children?: React.ReactNode
  infoProps?: InfoboxProps
  stopPropagation?: boolean
  onTitleClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  managedOpenState?: ManagedOpenState
}

const Collapse = ({
  defaultOpen,
  maximumHeight,
  icon,
  infoProps,
  children,
  oid,
  title,
  stopPropagation,
  onTitleClick,
  managedOpenState
}: CollapseProps) => {
  const [hide, setHide] = React.useState(!defaultOpen ?? true)

  const springProps = useMemo(() => {
    const style = { maxHeight: '0vh' }
    const mergedMaxHeight = managedOpenState ? managedOpenState.height : maximumHeight ?? '100vh'

    if (!managedOpenState) {
      if (!hide) {
        style.maxHeight = mergedMaxHeight
      } else {
        style.maxHeight = '0vh'
      }
    } else {
      if (managedOpenState.open) {
        style.maxHeight = mergedMaxHeight
      } else {
        style.maxHeight = '0vh'
      }
    }

    return style
  }, [hide, managedOpenState])

  const animationProps = useSpring(springProps)

  const mergedHide = managedOpenState ? managedOpenState.open : !hide

  return (
    <CollapseWrapper id={`Collapse_${oid}`} onMouseUp={(e) => stopPropagation && e.stopPropagation()}>
      <CollapseHeader collapsed={mergedHide} canClick={!!onTitleClick}>
        <CollapsableHeaderTitle onClick={(e) => onTitleClick && onTitleClick(e)}>
          <Icon className={'SidebarCollapseSectionIcon'} icon={icon} />
          {title}
          {infoProps && <Infobox {...infoProps} />}
        </CollapsableHeaderTitle>
        <CollapseToggle
          onClick={() => {
            if (managedOpenState) {
              managedOpenState.setOpen(!managedOpenState.open)
            } else setHide((b) => !b)
          }}
        >
          <Icon icon={mergedHide ? arrowDownSLine : arrowLeftSLine} />
        </CollapseToggle>
      </CollapseHeader>

      <CollapseContent style={animationProps}>{children}</CollapseContent>
    </CollapseWrapper>
  )
}

export default Collapse
