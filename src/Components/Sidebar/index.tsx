import gitBranchLine from '@iconify-icons/ri/git-branch-line'
import starLine from '@iconify-icons/ri/star-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { useLayoutStore } from '../../Layout/LayoutStore'
import links from '../../Conf/links'
import { SectionHeading, SidebarContent, SidebarDiv, SidebarSection } from '../../Styled/Sidebar'
import TreeNode from '../../Types/tree'
import Nav from './Nav'
import { TreeWithContextMenu } from './TreeWithContextMenu'

export type SideBarProps = { tree: TreeNode[]; starred: TreeNode[] }

const SideBar = ({ tree, starred }: SideBarProps) => {
  const sidebarVisible = useLayoutStore((store) => store.sidebar.visible)
  return (
    <SidebarDiv>
      <Nav links={links} />
      {sidebarVisible && (
        <SidebarContent>
          <h1>Sidebar</h1>

          <SidebarSection className="starred">
            <SectionHeading>
              <Icon height={20} icon={starLine} />
              <h2>Starred</h2>
            </SectionHeading>
            <TreeWithContextMenu tree={starred} />
          </SidebarSection>

          <SidebarSection className="tree">
            <SectionHeading>
              <Icon height={20} icon={gitBranchLine} />
              <h2>Tree</h2>
            </SectionHeading>
            <TreeWithContextMenu tree={tree} />
          </SidebarSection>
        </SidebarContent>
      )}
    </SidebarDiv>
  )
}

export default SideBar
