import React, { useMemo } from 'react'

import { TreeItem } from '@atlaskit/tree'
import { IpcAction } from '@data/IpcAction'
import { appNotifierWindow } from '@electron/utils/notifiers'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { AppType } from '@hooks/useInitialize'
import { useLastOpened } from '@hooks/useLastOpened'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import editLine from '@iconify/icons-ri/edit-line'
import magicLine from '@iconify/icons-ri/magic-line'
import PinIcon from '@iconify/icons-ri/pushpin-2-line'
import shareLine from '@iconify/icons-ri/share-line'
import volumeDownLine from '@iconify/icons-ri/volume-down-line'
// import refreshFill from '@iconify/icons-ri/refresh-fill'
import volumeMuteLine from '@iconify/icons-ri/volume-mute-line'
import { Icon } from '@iconify/react'
import { useContentStore } from '@store/useContentStore'
import useMultipleEditors from '@store/useEditorsStore'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { useSnippetStore } from '@store/useSnippetStore'
// import * as ContextMenu from '@radix-ui/react-context-menu'
//
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import toast from 'react-hot-toast'

import { LastOpenedState } from '../../../types/userPreference'
import { useShareModalStore } from '../Mention/ShareModalStore'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { useRefactorStore } from '../Refactor/Refactor'

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
  const toggleModal = useModalStore((store) => store.toggleOpen)
  const { goTo } = useRouting()
  const pinNote = useMultipleEditors((store) => store.pinNote)
  const pinnedNotes = useMultipleEditors((store) => store.pinned)
  const contents = useContentStore((store) => store.contents)

  const hasTemplate = useMemo(() => {
    const metadata = contents[item.data.nodeid]?.metadata
    const templates = useSnippetStore
      .getState()
      .snippets.filter((item) => item?.template && item.id === metadata?.templateID)

    return templates.length !== 0
  }, [item.data.nodeid, contents])

  const handleRefactor = (item: TreeItem) => {
    prefillRefactorModal(item?.data?.path)
    // openRefactorModal()
  }

  const handleArchive = (item: TreeItem) => {
    openDeleteModal(item.data.path)
  }

  const handleCreateChild = (item: TreeItem) => {
    // mog('handleCreateChild', { item })
    const node = createNewNote({ parent: item.data.path })
    goTo(ROUTE_PATHS.node, NavigationType.push, node?.nodeid)
  }

  const handlePinNote = (item: TreeItem) => {
    const noteId = item?.data?.nodeid
    if (pinnedNotes.has(noteId)) {
      appNotifierWindow(IpcAction.SHOW_PINNED_NOTE_WINDOW, AppType.MEX, { noteId })
    } else {
      pinNote(noteId)
      appNotifierWindow(IpcAction.PIN_NOTE_WINDOW, AppType.MEX, { noteId })
    }
  }

  const handleTemplate = (item: TreeItem) => {
    if (item.data.path !== 'Drafts') {
      toggleModal(ModalsType.template, item.data.nodeid)
    } else {
      toast.error('Template cannot be set for Drafts hierarchy')
    }
  }

  const handleShare = (item: TreeItem) => {
    openShareModal('permission', item.data.nodeid)
  }

  return (
    <>
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
          Pin this Note
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
        <ContextMenuSeparator />
        <MuteMenuItem nodeid={item.data.nodeid} lastOpenedState={item.data.lastOpenedState} />
        {/* <ContextMenuItem>
          <Icon icon={refreshFill} />
          Sync
        </ContextMenuItem>
         */}

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
    </>
  )
}
