import useLayout from '@hooks/useLayout'
import { useLayoutStore } from '@store/useLayoutStore'
import { SideNav } from '@style/Nav'
import { mog } from '@utils/lib/helper'
import { ROUTE_PATHS } from '@views/routes/urls'
import React from 'react'
import { useMatch } from 'react-router-dom'
import InfoBar from './InfoBar'

const RHSidebarContent = () => {
  const sidebar = useLayoutStore((store) => store.rhSidebar)
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isArchiveEditor = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)
  const isArchive = useMatch(ROUTE_PATHS.archive)

  mog('IS RHSIDEBAR', { sidebar, isEditor, isArchive })

  if (!sidebar.show) return <></>

  if (isEditor) return <InfoBar />

  if (isArchive || isArchiveEditor) return <></>

  return <></>
}

const RHSidebar = () => {
  const { getFocusProps } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const rhSidebar = useLayoutStore((store) => store.rhSidebar)

  return (
    <SideNav show={rhSidebar.show} expanded={rhSidebar.expanded} {...getFocusProps(focusMode)}>
      <RHSidebarContent />
    </SideNav>
  )
}

export default RHSidebar
