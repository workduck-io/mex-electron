import { useHistoryStore } from '../../Editor/Store/HistoryStore'
import { useRecentsStore } from '../../Editor/Store/RecentsStore'
import useLoad from '../useLoad/useLoad'

export const useNavigation = () => {
  // const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const { loadNode } = useLoad()
  const pushHs = useHistoryStore((store) => store.push)
  const replaceHs = useHistoryStore((store) => store.replace)
  const moveHs = useHistoryStore((store) => store.move)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const getCurrentUID = useHistoryStore((store) => store.getCurrentUId)

  const push = (uid: string) => {
    pushHs(uid)
    addRecent(uid)
    loadNode(uid)
  }

  const replace = (uid: string) => {
    replaceHs(uid)
    addRecent(uid)
    loadNode(uid)
  }

  const move = (dist: number) => {
    moveHs(dist)
    const newId = getCurrentUID()
    if (newId) {
      loadNode(newId)
      addRecent(newId)
    }
    return newId
  }

  return { push, move, replace }
}
