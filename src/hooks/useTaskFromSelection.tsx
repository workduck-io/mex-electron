import { SEPARATOR } from '@components/mex/Sidebar/treeUtils'
import { BASE_TASKS_PATH, defaultContent } from '@data/Defaults/baseData'
import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import { NodeEditorContent } from '../types/Types'
import { format } from 'date-fns'
import { generateTempId } from '@data/Defaults/idPrefixes'

export const getTodayTaskNodePath = () => {
  return `${BASE_TASKS_PATH}${SEPARATOR}${format(Date.now(), 'do MMM yyyy')}`
}

export const useTaskFromSelection = () => {
  const getNewTaskNode = (create?: boolean) => {
    const todayTaskNodePath = getTodayTaskNodePath()
    const links = useDataStore.getState().ilinks

    const link = links.find((l) => l.path === todayTaskNodePath)

    const node = link
      ? link
      : create
      ? useDataStore.getState().addILink({
          ilink: todayTaskNodePath
        })
      : undefined

    return node
  }

  const getNewTaskContent = (selection?: NodeEditorContent, create?: boolean) => {
    const node = getNewTaskNode(create)
    const content = node ? useContentStore.getState().getContent(node.nodeid) : defaultContent

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