import Tree from '@components/mex/Sidebar/Tree'
import React, { useMemo } from 'react'
import { PinnedList, SidebarToggle, SingleSpace, SpaceHeader, SpaceTitle, SpaceTitleWrapper } from './Sidebar.style'
import { MexTree } from './Sidebar.tree'
import { FlatSidebarItem, SidebarFlatList, SidebarSpace } from './Sidebar.types'
import Tippy from '@tippyjs/react'
import { TitleWithShortcut } from '@workduck-io/mex-components'
import { useLayoutStore } from '@store/useLayoutStore'
import { useEditorStore } from '@store/useEditorStore'
import { Icon } from '@iconify/react'
import useLayout from '@hooks/useLayout'
import SidebarListItemComponent from '@components/mex/Sidebar/SidebarListItem'

interface SidebarSpaceProps {
  space: SidebarSpace
}

export const SidebarSpaceComponent = ({ space }: SidebarSpaceProps) => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  // const node = useEditorStore((store) => store.node)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const focusMode = useLayoutStore((state) => state.focusMode)
  const isUserEdititng = useEditorStore((store) => store.isEditing)
  const { getFocusProps } = useLayout()

  // return <div>Space</div>
  return (
    <SingleSpace>
      <SpaceHeader>
        <SpaceTitleWrapper>
          <SpaceTitle>
            <Icon icon={space.icon} />
            {space.label}
          </SpaceTitle>
          <Tippy
            theme="mex-bright"
            placement="right"
            content={<TitleWithShortcut title={sidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
          >
            <SidebarToggle isVisible={!isUserEdititng} onClick={toggleSidebar} {...getFocusProps(focusMode)}>
              <Icon
                icon={sidebar.expanded ? 'heroicons-solid:chevron-double-left' : 'heroicons-solid:chevron-double-right'}
              />
            </SidebarToggle>
          </Tippy>
        </SpaceTitleWrapper>
        {space.pinnedItems && <space.pinnedItems />}
      </SpaceHeader>

      {/*
      {space.popularTags && space.popularTags.length > 0 && (
        <div>
          {space.popularTags.map((t) => (
            <div key={`tag_${t}`}>#{t}</div>
          ))}
        </div>
      ) */}
      {
        {
          hierarchy: space.list.type === 'hierarchy' && <MexTree items={space.list.items} filterText="Filter Notes" />,
          flat: space.list.type === 'flat' && <space.list.renderItems />
        }[space.list.type]
      }
    </SingleSpace>
  )
}
