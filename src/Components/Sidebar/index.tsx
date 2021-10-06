import gitBranchLine from '@iconify-icons/ri/git-branch-line'
import starLine from '@iconify-icons/ri/star-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { config, useTransition } from 'react-spring'
import { useLayoutStore } from '../../Layout/LayoutStore'
import { SectionHeading, SidebarContent, SidebarDiv, SidebarSection } from '../../Styled/Sidebar'
import TreeNode from '../../Types/tree'
import { TreeWithContextMenu } from './TreeWithContextMenu'

export type SideBarProps = { tree: TreeNode[]; starred: TreeNode[] }

export const useFocusTransition = () => {
  const focusMode = useLayoutStore((store) => store.focusMode)

  const transitions = useTransition(!focusMode, {
    from: {
      opacity: 0
      // width: '0%',
    },
    enter: {
      opacity: 1
      // width: '100%',
    },
    leave: {
      opacity: 0
      // width: '0%',
    },
    reverse: !focusMode,
    delay: 0,
    config: config.slow,
    onStart: ({ value }) => {
      // if (sidebarVisible) setSidebarWidth(0)
      // else setSidebarWidth(300)
    },
    onRest: ({ value }) => {
      // if (!sidebarVisible) setSidebarWidth(0)
    }
  })

  return { transitions }
}

const SideBar = ({ tree, starred }: SideBarProps) => {
  const { transitions } = useFocusTransition()

  return transitions(
    (styles, item) =>
      item && (
        <SidebarDiv style={styles}>
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
        </SidebarDiv>
      )
  )
}

export default SideBar
