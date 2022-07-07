import bookmark3Line from '@iconify/icons-ri/bookmark-3-line'
import React from 'react'
import { BookmarksHelp } from '../../../data/Defaults/helpText'
import useLayout from '../../../hooks/useLayout'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { SidebarContent, SidebarDiv, SidebarDivider } from '../../../style/Sidebar'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import Bookmarks from './Bookmarks'
// import { TreeWithContextMenu } from './TreeWithContextMenu'

const SideBar = () => {
  const focusMode = useLayoutStore((s) => s.focusMode)
  const { getFocusProps } = useLayout()

  return (
    <SidebarDiv {...getFocusProps(focusMode)}>
      <SidebarContent>
        <Collapse
          title="Bookmarks"
          oid="Bookmarks"
          icon={bookmark3Line}
          maximumHeight="30vh"
          infoProps={{
            text: BookmarksHelp
          }}
        >
          <Bookmarks />
        </Collapse>

        <SidebarDivider />
      </SidebarContent>
    </SidebarDiv>
  )
}

export default SideBar
