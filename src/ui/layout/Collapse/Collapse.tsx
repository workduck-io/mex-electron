import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import { Icon, IconifyIcon } from '@iconify/react'
import React, { useMemo } from 'react'
import { useSpring } from 'react-spring'
import { CollapseContent, CollapseHeader, CollapseWrapper } from './Collapse.style'

interface CollapseProps {
  oid?: string
  defaultOpen?: boolean
  title: string
  maximumHeight?: string
  icon?: string | IconifyIcon
  children?: React.ReactNode
}

const Collapse = ({ defaultOpen, maximumHeight, icon, children, oid, title }: CollapseProps) => {
  const [hide, setHide] = React.useState(!defaultOpen ?? true)

  const springProps = useMemo(() => {
    const style = { maxHeight: '0vh' }

    if (!hide) {
      style.maxHeight = maximumHeight ?? '100vh'
    } else {
      style.maxHeight = '0vh'
    }

    return style
  }, [hide])

  const animationProps = useSpring(springProps)

  return (
    <CollapseWrapper id={`Collapse_${oid}`}>
      <CollapseHeader
        onClick={() => {
          setHide((b) => !b)
        }}
      >
        <Icon icon={hide ? arrowRightSLine : icon} />
        <h2>{title}</h2>
      </CollapseHeader>

      <CollapseContent style={animationProps}>{children}</CollapseContent>
    </CollapseWrapper>
  )
}

export default Collapse
