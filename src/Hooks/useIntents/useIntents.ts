import { Intent } from '../../Editor/Components/SyncBlock/SyncBlock.types'
import { useSyncStore } from '../../Editor/Store/SyncStore'

const useIntents = () => {
  const intents = useSyncStore((store) => store.intents)

  const getIntents = (id: string, templateId: string) => {
    const nodeIntents = intents[id]
    if (nodeIntents) {
      const templateIntents = nodeIntents.intentGroups[templateId]
      return templateIntents
    }
    return undefined
  }

  // const addIntent = (id: string, templateId: string, intent: Intent) => {}

  return { getIntents }
}

export default useIntents
