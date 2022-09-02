import Tree from '@components/mex/Sidebar/Tree'
import React, { useMemo } from 'react'
import { MexTree } from './Sidebar.tree'
import { FlatSidebarItem, SidebarFlatList, SidebarSpace } from './Sidebar.types'

interface SidebarSpaceProps {
  space: SidebarSpace
}

export const SidebarSpaceComponent = ({ space }: SidebarSpaceProps) => {
  // const node = useEditorStore((store) => store.node)

  return (
    <div>
      Render SidebarSpace
      <div>
        <h1>{space.label}</h1>
        <div>SidebarToggle</div>
      </div>
      <div>
        <h1>Pinned Notes</h1>
        {space.pinnedItems.map((i) => (
          <div key={`pinned_${i.id}`}>{i.label}</div>
        ))}
        <div>Pin Current Note</div>
      </div>
      {space.popularTags && space.popularTags.length > 0 && (
        <div>
          <h1>Most used Tags</h1>
          {space.popularTags.map((t) => (
            <div key={`tag_${t}`}>#{t}</div>
          ))}
        </div>
      )}
      <div>
        <h1>Notes</h1>
        {
          {
            hierarchy: space.list.type === 'hierarchy' && (
              <MexTree items={space.list.items} filterText="Filter Notes" />
            ),
            flat: space.list.type === 'flat' && <space.list.renderItems />
          }[space.list.type]
        }
      </div>
    </div>
  )
}
