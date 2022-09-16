import React, { useMemo } from 'react'

import { TreeItem } from '@atlaskit/tree'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useLastOpened } from '@hooks/useLastOpened'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import editLine from '@iconify/icons-ri/edit-line'
import fileTransferLine from '@iconify/icons-ri/file-transfer-line'
import magicLine from '@iconify/icons-ri/magic-line'
import PinIcon from '@iconify/icons-ri/pushpin-2-line'
import shareLine from '@iconify/icons-ri/share-line'
import volumeDownLine from '@iconify/icons-ri/volume-down-line'
// import refreshFill from '@iconify/icons-ri/refresh-fill'
import volumeMuteLine from '@iconify/icons-ri/volume-mute-line'
import { Icon } from '@iconify/react'
import { useContentStore } from '@store/useContentStore'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { useSnippetStore } from '@store/useSnippetStore'
// import * as ContextMenu from '@radix-ui/react-context-menu'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import useDataStore from '@store/useDataStore'
//
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import toast from 'react-hot-toast'

import usePinnedWindows from '@hooks/usePinnedWindow'
import { RESERVED_NAMESPACES } from '@utils/lib/paths'

import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { LastOpenedState } from '../../../types/userPreference'
import { useShareModalStore } from '../Mention/ShareModalStore'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { useRefactorStore } from '../Refactor/Refactor'
import { doesLinkRemain } from '../Refactor/doesLinkRemain'
import ContextMenuListWithFilter from './ContextMenuListWithFilter'

export const MENU_ID = 'Tree-Menu'

interface MuteMenuItemProps {
  nodeid: string
  lastOpenedState: LastOpenedState
}

export const MuteMenuItem = ({ nodeid, lastOpenedState }: MuteMenuItemProps) => {
  const { muteNode, unmuteNode } = useLastOpened()

  const isMuted = useMemo(() => {
    if (nodeid === 'NODE_WQgXbba9aBJV6X8ckDWp6') {
      mog('isMuted for special', { lastOpenedState, nodeid })
    }
    return lastOpenedState === LastOpenedState.MUTED
  }, [nodeid, lastOpenedState])

  const handleMute = () => {
    // mog('handleMute', { item })
    if (isMuted) {
      unmuteNode(nodeid)
    } else {
      muteNode(nodeid)
    }
  }

  return (
    <ContextMenuItem
      onSelect={(args) => {
        handleMute()
      }}
    >
      <Icon icon={isMuted ? volumeDownLine : volumeMuteLine} />
      {isMuted ? 'Unmute' : 'Mute'}
    </ContextMenuItem>
  )
}

interface TreeContextMenuProps {
  item: TreeItem
}

export const TreeContextMenu = ({ item }: TreeContextMenuProps) => {
  const prefillRefactorModal = useRefactorStore((store) => store.prefillModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNote } = useCreateNewNote()
  const openShareModal = useShareModalStore((store) => store.openModal)
  const { onPinNote, onUnpinNote, isPinned } = usePinnedWindows()
  const toggleModal = useModalStore((store) => store.toggleOpen)
  const { goTo } = useRouting()
  const namespaces = useDataStore((store) => store.namespaces)

  const contents = useContentStore((store) => store.contents)
  const { execRefactorAsync } = useRefactor()
  const { push } = useNavigation()

  const hasTemplate = useMemo(() => {
    const metadata = contents[item.data.nodeid]?.metadata
    const templates = useSnippetStore
      .getState()
      .snippets.filter((item) => item?.template && item.id === metadata?.templateID)

    return templates.length !== 0
  }, [item.data.nodeid, contents])

  const handleRefactor = (item: TreeItem) => {
    prefillRefactorModal({ path: item?.data?.path, namespaceID: item.data?.namespace })
    // openRefactorModal()
  }

  const handleArchive = (item: TreeItem) => {
    openDeleteModal(item.data.path)
  }

  const handleCreateChild = (item: TreeItem) => {
    mog('handleCreateChild', { item })
    const node = createNewNote({ parent: { path: item.data.path, namespace: item.data.namespace } })
    goTo(ROUTE_PATHS.node, NavigationType.push, node?.nodeid)
  }

  const handlePinNote = (item: TreeItem) => {
    const noteId = item?.data?.nodeid
    if (!isPinned(noteId)) {
      onPinNote(noteId)
    } else {
      onUnpinNote(noteId)
    }
  }

  const handleTemplate = (item: TreeItem) => {
    if (item.data.path !== 'Drafts') {
      toggleModal(ModalsType.template, item.data)
    } else {
      toast.error('Template cannot be set for Drafts hierarchy')
    }
  }

  const handleShare = (item: TreeItem) => {
    openShareModal('permission', item.data.nodeid)
  }

  // BUG: The backend doesn't return the new added path in the selected namespace
  const handleMoveNamespaces = async (newNamespaceID: string) => {
    const refactored = await execRefactorAsync(
      { path: item.data?.path, namespaceID: item.data?.namespace },
      { path: item.data?.path, namespaceID: newNamespaceID }
    )

    if (doesLinkRemain(item.data?.path, refactored)) {
      push(item.data?.nodeid, { savePrev: false })
    }
  }

  return (
    <>
      <ContextMenuPrimitive.Portal>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={(args) => {
              handleRefactor(item)
            }}
          >
            <Icon icon={editLine} />
            Refactor
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={(args) => {
              handleCreateChild(item)
            }}
          >
            <Icon icon={addCircleLine} />
            New Note
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={(args) => {
              handlePinNote(item)
            }}
          >
            <Icon icon={PinIcon} />
            {`${isPinned(item?.data?.nodeid) ? 'Unpin' : 'Pin'} this Note`}
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={(args) => {
              handleTemplate(item)
            }}
          >
            <Icon icon={magicLine} />
            {hasTemplate ? 'Change Template' : 'Set Template'}
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={(args) => {
              handleShare(item)
            }}
          >
            <Icon icon={shareLine} />
            Share
          </ContextMenuItem>
          <ContextMenuListWithFilter
            item={{
              id: 'menu_for_namespace',
              label: 'Move to Space',
              icon: fileTransferLine
            }}
            items={namespaces
              // Don't move in same namespace
              .filter((ns) => ns.id !== item.data.namespace)
              .map((ns) => ({
                id: ns.id,
                icon: ns.name === RESERVED_NAMESPACES.default ? 'ri:user-line' : 'heroicons-outline:view-grid',
                label: ns.name
              }))}
            onSelectItem={(args) => {
              handleMoveNamespaces(args)
            }}
            filter={false}
          />
          <ContextMenuSeparator />
          <MuteMenuItem nodeid={item.data.nodeid} lastOpenedState={item.data.lastOpenedState} />

          <ContextMenuItem
            color="#df7777"
            onSelect={(args) => {
              handleArchive(item)
            }}
          >
            <Icon icon={archiveLine} />
            Archive
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuPrimitive.Portal>
    </>
  )
}
