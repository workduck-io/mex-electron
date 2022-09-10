import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { defaultContent, getRandomQAContent } from '@data/Defaults/baseData'
import { generateSnippetId } from '@data/Defaults/idPrefixes'
import { IconifyIcon } from '@iconify/react'
import generateName from 'project-name-generator'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useCreateNewNote } from './useCreateNewNote'
import { useUpdater } from './useUpdater'
import { useSnippetStore } from '@store/useSnippetStore'
import { useSnippets } from './useSnippets'
import { useNamespaces } from './useNamespaces'
import { mog } from '@workduck-io/mex-utils'
import { useLayoutStore } from '@store/useLayoutStore'

interface CreateNewMenuItem {
  id: string
  label: string
  icon?: string | IconifyIcon
  onSelect: () => void
}

export const useCreateNewMenu = () => {
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addSnippet } = useSnippets()
  const { updater } = useUpdater()
  const { addDefaultNewNamespace, getDefaultNamespaceId } = useNamespaces()
  const currentSpace = useLayoutStore((store) => store.sidebar.spaceId)
  const changeSpace = useLayoutStore((store) => store.changeSidebarSpace)

  // const createNoteWithQABlock = () => {
  //   const qaContent = getRandomQAContent()
  //   const note = createNewNote({ noteContent: qaContent })

  //   goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
  // }

  const createNewNamespace = () => {
    addDefaultNewNamespace().then((ns) => {
      // mog('After creating ns in contenxtmenu', { ns })
      // Change the space in the sidebar to the newly created space
      changeSpace(ns?.id)
    })
  }

  const createNewNoteInNamespace = (namespaceId: string) => {
    const qaContent = getRandomQAContent()
    const note = createNewNote({ namespace: namespaceId, noteContent: qaContent })
    mog('After creating note in namespace', { note })
    if (note) {
      goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
    }
  }

  const onCreateNewSnippet = () => {
    // Create a better way.
    const snippetId = generateSnippetId()
    const snippetName = generateName().dashed

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: 'ri:quill-pen-line',
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const getCreateNewMenuItems = (_path: string): CreateNewMenuItem[] => {
    return [
      {
        id: 'new-note',
        label: 'New Note',
        onSelect: () => {
          createNewNoteInNamespace(currentSpace || getDefaultNamespaceId())
        }
      },
      // {
      //   id: 'new-note-in-ns',
      //   label: 'New Note in Default Space',
      //   onSelect: () => {
      //     createNoteWithQABlock()
      //   }
      // },
      {
        id: 'new-space',
        label: 'New Space',
        onSelect: () => {
          createNewNamespace()
        }
      },
      {
        id: 'new-snippet',
        label: 'New Snippet',
        onSelect: () => {
          onCreateNewSnippet()
        }
      }
    ]
  }

  return { getCreateNewMenuItems }
}
