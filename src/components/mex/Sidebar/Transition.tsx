import { useMemo } from 'react'
import { useSpring } from 'react-spring'
import { useTheme } from 'styled-components'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { size } from '@style/responsive'
import { useMediaQuery } from 'react-responsive'

const sidebarCollapsedWidth = '86px'
const sidebarExpandedWidth = '340px'

export const useSidebarTransition = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const rhSidebar = useLayoutStore((state) => state.rhSidebar)
  const theme = useTheme()

  const isDesktop = useMediaQuery({ minWidth: size.wide })
  // const isSmall = useMediaQuery({ maxWidth: size.small })

  const sidebarStyle = useMemo(() => {
    const style = { width: '276px' }

    if (!sidebar.show || !sidebar.expanded) {
      style.width = '0px'
    }

    return style
  }, [sidebar])

  const springProps = useSpring(sidebarStyle)

  const { style: gridStyle, endColumnWidth } = useMemo(() => {
    const showSidebar = sidebar.show && sidebar.expanded
    const showRHSidebar = rhSidebar.show && rhSidebar.expanded
    const firstColumnWidth = `${showSidebar ? sidebarExpandedWidth : sidebarCollapsedWidth}`
    const visibleEndColumnWidth = `${isDesktop ? '600px' : '400px'}`
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    const style = {
      gridTemplateColumns: `${firstColumnWidth} 2fr ${endColumnWidth}`
    }
    // if (!sidebar.expanded || !sidebar.show) style.gridTemplateColumns = `${sidebarCollapsedWidth} 2fr auto`
    return { style, endColumnWidth }
  }, [sidebar, isDesktop, rhSidebar])

  const gridSpringProps = useSpring(gridStyle)

  const switchWrapperStyle = useMemo(() => {
    const style = {
      width: `calc(100% - ${sidebarExpandedWidth} - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }

    if (!sidebar.expanded || !sidebar.show) {
      style.width = `calc(100% - ${sidebarCollapsedWidth} - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }
    return style
  }, [sidebar, theme])

  const switchWrapperSpringProps = useSpring(switchWrapperStyle)

  return { sidebarStyle, springProps, gridStyle, gridSpringProps, switchWrapperSpringProps, endColumnWidth }
}
