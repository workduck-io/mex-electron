import { SharedNodeIcon, SharedNodeIconify } from '@components/icons/Icons'
import { useEditorStore } from '@store/useEditorStore'
import { ContextMenuContent } from '@ui/components/menus/contextMenu'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import { Centered } from './Bookmarks'
import SidebarList from './SidebarList'
import { SidebarListItem } from './SidebarList.types'
import { MuteMenuItem } from './TreeWithContextMenu'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { useLastOpened } from '@hooks/useLastOpened'

interface SharedNoteContextMenuProps {
  item: SidebarListItem
}

const SharedNoteContextMenu = ({ item }: SharedNoteContextMenuProps) => {
  const lastOpenedNote = useUserPreferenceStore((state) => state.lastOpenedNotes[item?.id])
  const { getLastOpened } = useLastOpened()

  const lastOpenedState = useMemo(() => {
    const loState = getLastOpened(item.id, lastOpenedNote)
    return loState
  }, [lastOpenedNote, item?.id])

  return (
    <>
      <ContextMenuContent>
        <MuteMenuItem lastOpenedState={lastOpenedState} nodeid={item.id} />
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
        title: node.path,
        icon: SharedNodeIconify
      }))}
      onClick={onOpenNode}
      showSearch
      ItemContextMenu={SharedNoteContextMenu}
      selectedItemId={node.nodeid}
      searchPlaceholder="Filter shared notes..."
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
