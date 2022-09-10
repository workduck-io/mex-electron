import { SEPARATOR } from '@components/mex/Sidebar/treeUtils'
import { BASE_TASKS_PATH, defaultContent } from '@data/Defaults/baseData'
import { generateTempId } from '@data/Defaults/idPrefixes'
import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import { format } from 'date-fns'
import { NodeEditorContent } from '../types/Types'
import { useCreateNewNote } from './useCreateNewNote'

export const getTodayTaskNodePath = () => {
  return `${BASE_TASKS_PATH}${SEPARATOR}${format(Date.now(), 'do MMM yyyy')}`
}

export const useTaskFromSelection = () => {
  const { createNewNote } = useCreateNewNote()

  const getNewTaskNode = (create?: boolean, nodeContent?: NodeEditorContent) => {
    const todayTaskNodePath = getTodayTaskNodePath()
    const links = useDataStore.getState().ilinks
    const link = links.find((l) => l.path === todayTaskNodePath)
    const dailyTaskNode = links.find((l) => l.path === BASE_TASKS_PATH)

    const node = link
      ? link
      : create
      ? createNewNote({
          path: todayTaskNodePath,
          parent: dailyTaskNode?.nodeid,
          noteContent: nodeContent
        })
      : undefined

    // mog('getting new task node', { links, link, create, todayTaskNodePath })
    return node
  }

  const getNewTaskContent = (selection?: NodeEditorContent, create?: boolean) => {
    const node = getNewTaskNode(create)
    const content = node ? useContentStore.getState().getContent(node.nodeid) : defaultContent

    // mog('getting new task node', { selection, create, node, content })

    const newTask = {
      type: 'action_item',
      id: generateTempId(),
      children: [selection]
    }

    return [...content.content, newTask]
  }

  return {
    getNewTaskContent,
    getNewTaskNode
  }
}
