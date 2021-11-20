import gitBranchLine from '@iconify-icons/ri/git-branch-line'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { config, useTransition } from 'react-spring'
import { useLayoutStore } from '../../Layout/LayoutStore'
import { SectionHeading, SidebarContent, SidebarDiv, SidebarDivider, SidebarSection } from '../../Styled/Sidebar'
import TreeNode from '../../Types/tree'
import Bookmarks from './Bookmarks'
import { TreeWithContextMenu } from './TreeWithContextMenu'
import arrowRightSLine from '@iconify-icons/ri/arrow-right-s-line'
import bookmark3Line from '@iconify-icons/ri/bookmark-3-line'

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
  const [sHide, setShide] = useState(false)
  const [tHide, setThide] = useState(false)

  return transitions(
    (styles, item) =>
      item && (
        <SidebarDiv style={styles}>
          <SidebarContent>
            <SidebarSection className="starred">
              <SectionHeading
                onClick={() => {
                  setShide((b) => !b)
                }}
              >
                <Icon height={20} icon={sHide ? arrowRightSLine : bookmark3Line} />
                <h2>Bookmarks</h2>
              </SectionHeading>

              {!sHide && <Bookmarks />}
            </SidebarSection>

            <SidebarDivider />

            <SidebarSection className="tree">
              <SectionHeading
                onClick={() => {
                  setThide((b) => !b)
                }}
              >
                <Icon height={20} icon={tHide ? arrowRightSLine : gitBranchLine} />
                <h2>Tree</h2>
              </SectionHeading>
              {!tHide && <TreeWithContextMenu tree={tree} />}
            </SidebarSection>
          </SidebarContent>
        </SidebarDiv>
      )
  )
}

export default SideBar
