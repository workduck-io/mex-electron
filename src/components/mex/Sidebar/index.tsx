import bookmark3Line from '@iconify/icons-ri/bookmark-3-line'
import gitBranchLine from '@iconify/icons-ri/git-branch-line'
import React from 'react'
import useLayout from '../../../hooks/useLayout'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { SidebarContent, SidebarDiv, SidebarDivider } from '../../../style/Sidebar'
import TreeNode from '../../../types/tree'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import Bookmarks from './Bookmarks'
import { TreeWithContextMenu } from './TreeWithContextMenu'

export type SideBarProps = { tree: TreeNode[]; starred: TreeNode[] }

const SideBar = ({ tree }: SideBarProps) => {
  // const { transitions } = useFocusTransition()
  const focusMode = useLayoutStore((s) => s.focusMode)
  const { getFocusProps } = useLayout()

  return (
    <SidebarDiv {...getFocusProps(focusMode)}>
      <SidebarContent>
        <Collapse title="Bookmarks" icon={bookmark3Line} maximumHeight="30vh">
          <Bookmarks />
        </Collapse>

        <SidebarDivider />

        <Collapse title="Tree" defaultOpen icon={gitBranchLine} maximumHeight="80vh">
          <TreeWithContextMenu tree={tree} />
        </Collapse>
      </SidebarContent>
    </SidebarDiv>
  )
}

export default SideBar
