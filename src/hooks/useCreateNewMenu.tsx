import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { getRandomQAContent } from '@data/Defaults/baseData'
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

// TODO: Add ordering and filtering based on Path
interface CreateNewMenuConfig {
  // If passed, and the path matches/starts with this path
  // The menu item is moved above
  path?: string
}

export const useCreateNewMenu = () => {
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addSnippet } = useSnippets()
  const { updater } = useUpdater()
  const { addDefaultNewNamespace } = useNamespaces()
  const changeSpace = useLayoutStore((store) => store.changeSidebarSpace)

  const createNoteWithQABlock = () => {
    const qaContent = getRandomQAContent()
    const note = createNewNote({ noteContent: qaContent })

    goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
  }

  const createNewNamespace = () => {
    addDefaultNewNamespace().then((ns) => {
      // mog('After creating ns in contenxtmenu', { ns })
      // Change the space in the sidebar to the newly created space
      changeSpace(ns?.id)
    })
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
          createNoteWithQABlock()
        }
      },
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
