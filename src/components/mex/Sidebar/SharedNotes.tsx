import { SharedNodeIcon, SharedNodeIconify } from '@components/icons/Icons'
import { SharedNode } from '../../../types/Types'
import { useEditorStore } from '@store/useEditorStore'
import { ContextMenuContent } from '@ui/components/menus/contextMenu'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import { useTheme } from 'styled-components'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import { Centered } from './StarredNotes'
import SidebarList from './SidebarList'
import { SidebarListItem } from './SidebarList.types'
import { MuteMenuItem } from './TreeWithContextMenu'

interface SharedNoteContextMenuProps {
  item: SidebarListItem<SharedNode>
}

const SharedNoteContextMenu = ({ item }: SharedNoteContextMenuProps) => {
  return (
    <>
      <ContextMenuContent>
        <MuteMenuItem lastOpenedState={item?.lastOpenedState} nodeid={item.id} />
      </ContextMenuContent>
    </>
  )
}

const SharedNotes = () => {
  const sharedNodes = useDataStore((store) => store.sharedNodes)
  const { push } = useNavigation()

  // const [sharedNodes, setSharedNodes] = useState<SharedNode[]>([])
  const { goTo } = useRouting()
  const theme = useTheme()
  const node = useEditorStore((s) => s.node)

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  return sharedNodes.length > 0 ? (
    <SidebarList
      noMargin
      items={sharedNodes.map((node) => ({
        id: node.nodeid,
        label: node.path,
        icon: SharedNodeIconify,
        lastOpenedId: node.nodeid,
        data: node
      }))}
      onClick={onOpenNode}
      showSearch
      ItemContextMenu={SharedNoteContextMenu}
      selectedItemId={node.nodeid}
      searchPlaceholder="Filter Shared Notes"
      emptyMessage="No shared notes found"
    />
  ) : (
    <Centered>
      <SharedNodeIcon height={64} width={64} fill={theme.colors.text.default} margin="0 0 1rem 0" />
      <span>No one has shared Notes with you yet!</span>
    </Centered>
  )
}

export default SharedNotes
