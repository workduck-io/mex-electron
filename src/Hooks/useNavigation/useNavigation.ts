import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useHistoryStore } from '../../Editor/Store/HistoryStore'
import { useRecentsStore } from '../../Editor/Store/RecentsStore'

export const useNavigation = () => {
  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const pushHs = useHistoryStore((store) => store.push)
  const replaceHs = useHistoryStore((store) => store.replace)
  const moveHs = useHistoryStore((store) => store.move)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const getCurrentNodeId = useHistoryStore((store) => store.getCurrentNodeId)

  const push = (id: string) => {
    pushHs(id)
    addRecent(id)
    loadNodeFromId(id)
  }

  const replace = (id: string) => {
    replaceHs(id)
    addRecent(id)
    loadNodeFromId(id)
  }

  const move = (dist: number) => {
    moveHs(dist)
    const newId = getCurrentNodeId()
    if (newId) {
      loadNodeFromId(newId)
      addRecent(newId)
    }
    return newId
  }

  return { push, move, replace }
}
