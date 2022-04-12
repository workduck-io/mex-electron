import { useMemo } from 'react'
import { useSpring } from 'react-spring'
import { useTheme } from 'styled-components'
import { useLayoutStore } from '../../../store/useLayoutStore'

export const useSidebarTransition = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const theme = useTheme()

  const sidebarStyle = useMemo(() => {
    const style = { width: '300px' }

    if (!sidebar.expanded) style.width = '64px'

    return style
  }, [sidebar])

  const springProps = useSpring(sidebarStyle)

  const gridStyle = useMemo(() => {
    const style = {
      gridTemplateColumns: '300px 2fr auto'
    }
    if (!sidebar.expanded) style.gridTemplateColumns = '64px 2fr auto'
    return style
  }, [sidebar])
  const gridSpringProps = useSpring(gridStyle)

  const switchWrapperStyle = useMemo(() => {
    const style = {
      width: `calc(100% - 300px - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }

    if (!sidebar.expanded) {
      style.width = `calc(100% - 64px - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }
    return style
  }, [sidebar, theme])

  const switchWrapperSpringProps = useSpring(switchWrapperStyle)

  return { sidebarStyle, springProps, gridStyle, gridSpringProps, switchWrapperSpringProps }
}
