import { nanoid } from 'nanoid'
import { Intent, IntentTemplate, SyncBlockTemplate } from '../../Editor/Components/SyncBlock/SyncBlock.types'
import { useSyncStore } from '../../Editor/Store/SyncStore'

const useIntents = () => {
  const addIgid = useSyncStore((store) => store.addIgid)

  const checkAndGenerateIGID = (id: string, templateId: string): string => {
    const templates = useSyncStore.getState().templates
    const template = templates.find((t) => t.id === templateId)
    // console.log('checkAndGenerateIGID', { template, templates })

    if (template) {
      const blockIntents: (Intent | undefined)[] = extractIntentsFromTemplate(template.intents, id)

      if (blockIntents) {
        const areAllIntentsPresent = blockIntents.reduce((prev, cur) => {
          if (cur) return prev || true
          else return false
        }, true)

        if (areAllIntentsPresent) {
          const igid = getIntentGroupId(id, templateId)
          return igid
        } else {
          const newIgid = `IGID_${nanoid()}`
          addIgid(id, newIgid, blockIntents, templateId)
          return newIgid
        }
      } else {
        throw new Error('Intents not defined')
      }
    } else {
      throw new Error('Template Not found')
    }
  }

  const extractIntentsFromTemplate = (templateIntents: IntentTemplate[], id: string): (Intent | undefined)[] => {
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[id]
    // console.log('extractIntentsFromTemplate ', { id, templateIntents, nodeIntents })
    const intents = templateIntents.map((ti) => {
      const intent = nodeIntents.intents.find((i) => i.service === ti.service && i.type === ti.type)
      if (intent === undefined) {
        return undefined
      }
      return intent
    })
    return intents
  }

  const getTemplate = (id: string, intentGroupId: string) => {
    const templates = useSyncStore.getState().templates
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[id]
    console.log('getTemplate', { templates, nodeIntents })

    if (nodeIntents) {
      const intentGroup = nodeIntents.intentGroups[intentGroupId]
      const template: SyncBlockTemplate = templates.find((t) => t.id === intentGroup.templateId)
      if (template) return template
    }
    return undefined
  }

  const getIntents = (id: string, intentGroupId: string) => {
    const template = getTemplate(id, intentGroupId)
    if (template) {
      const templateIntents = template.intents
      return extractIntentsFromTemplate(templateIntents, id)
    }
    return undefined
  }

  const getNodeIntents = (id: string) => {
    const StoreIntents = useSyncStore.getState().intents
    const StoreServices = useSyncStore.getState().services
    const nodeIntents = StoreIntents[id]

    const mappedIntents = StoreServices.map((s) => {
      if (nodeIntents) {
        const intent = nodeIntents.intents.find((i) => i.service === s.id)
        return { intent, service: s }
      }
      return { intent: undefined, service: s }
    })

    return mappedIntents
  }

  const getIntentGroupId = (id: string, templateId: string) => {
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[id]
    let intentGroupId: string | undefined
    if (nodeIntents) {
      const intentGroups = nodeIntents.intentGroups
      Object.keys(intentGroups).forEach((k) => {
        if (templateId === intentGroups[k].templateId) {
          intentGroupId = k
        }
      })
    }
    return intentGroupId
  }

  return { getIntents, getTemplate, getIntentGroupId, checkAndGenerateIGID, getNodeIntents }
}

export default useIntents
