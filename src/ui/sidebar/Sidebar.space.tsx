import Tree from '@components/mex/Sidebar/Tree'
import { useTreeFromLinks } from '@hooks/useTreeFromLinks'
import React, { useMemo } from 'react'
import { SidebarSpace } from './Sidebar.types'

interface SidebarSpaceProps {
  space: SidebarSpace
}

export const SidebarSpaceComponent = ({ space }: SidebarSpaceProps) => {
  // const node = useEditorStore((store) => store.node)

  const { getTreeFromLinks } = useTreeFromLinks()

  const initTree = useMemo(() => {
    if (space.list.type === 'hierarchy') {
      return getTreeFromLinks(space.list.items)
    }
    return
  }, [space])

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
        <h1>Hierarchy</h1>
        <input type="text" placeholder={`Filter ${space.label}`} />
        {space.list.type === 'hierarchy' ? initTree && <Tree initTree={initTree} /> : <div>Flat list here</div>}
      </div>
    </div>
  )
}
