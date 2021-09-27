import { Intent, IntentTemplate, SyncBlockTemplate } from '../../Editor/Components/SyncBlock/SyncBlock.types'
import { useSyncStore } from '../../Editor/Store/SyncStore'

const useIntents = () => {
  const StoreIntents = useSyncStore((store) => store.intents)
  const templates = useSyncStore((store) => store.templates)

  const generateIntents = (templateIntents: IntentTemplate[], id: string) => {
    const nodeIntents = StoreIntents[id]
    const intents = templateIntents.map((ti) => {
      const intent = nodeIntents.intents.find((i) => i.service === ti.service && i.type === ti.type)
      return intent
    })
    return intents
  }

  const getTemplate = (id: string, intentGroupId: string) => {
    const nodeIntents = StoreIntents[id]
    if (nodeIntents) {
      const templateId = nodeIntents.intentGroups[intentGroupId]
      const template: SyncBlockTemplate = templates[templateId]
      if (template) return template
    }
    return undefined
  }

  const getIntents = (id: string, intentGroupId: string) => {
    const template = getTemplate(id, intentGroupId)
    if (template) {
      const templateIntents = template.intents
      const intents = generateIntents(templateIntents, id)
    }
    return undefined
  }

  return { getIntents, getTemplate }
}

export default useIntents
