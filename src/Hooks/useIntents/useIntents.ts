import { nanoid } from 'nanoid'
import {
  Intent,
  IntentGroup,
  IntentTemplate,
  SyncBlockTemplate
} from '../../Editor/Components/SyncBlock/SyncBlock.types'
import { useSyncStore } from '../../Editor/Store/SyncStore'

const useIntents = () => {
  const addIgid = useSyncStore((store) => store.addIgid)
  const addIntentEmptyMap = useSyncStore((store) => store.addIntentEmptyMap)
  const updateIntentsAndIGIDs = useSyncStore((store) => store.updateIntentsAndIGIDs)

  const checkAndGenerateIGID = (id: string, templateId: string): string => {
    const templates = useSyncStore.getState().templates
    const template = templates.find((t) => t.id === templateId)
    // console.log('checkAndGenerateIGID', { template, templates })

    if (template) {
      const blockIntents: (Intent | IntentTemplate | undefined)[] = extractIntentsFromTemplate(template.intents, id)

      if (blockIntents) {
        const areAllIntentsPresent = blockIntents.reduce((prev, cur) => {
          if (cur) return prev || true
          else return false
        }, true)

        if (areAllIntentsPresent) {
          const igid = getIntentGroupId(id, templateId)
          if (igid) return igid
        } else {
          const filteredBlockIntents = blockIntents.filter((i) => i.type === 'Intent') as Intent[]
          const newIgid = `IGID_${nanoid()}`
          if (filteredBlockIntents.length === blockIntents.length) {
            addIgid(id, newIgid, filteredBlockIntents, templateId)
            console.log({ id, newIgid, blockIntents, templateId })
            return newIgid
          }
        }
      } else {
        throw new Error('Intents not defined')
      }
    } else {
      throw new Error('Template Not found')
    }
  }

  const extractIntentsFromTemplate = (
    templateIntents: IntentTemplate[],
    id: string
  ): (Intent | IntentTemplate | undefined)[] => {
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[id]
    // console.log('extractIntentsFromTemplate ', { id, templateIntents, nodeIntents })
    if (nodeIntents) {
      const intents = templateIntents.map((ti) => {
        const intent = nodeIntents.intents.find((i) => i.service === ti.service && i.type === ti.type)
        if (intent === undefined) {
          return {
            ...ti
          }
        }
        return intent
      })
      return intents
    }
    addIntentEmptyMap(id)
    return templateIntents.map(() => undefined)
  }

  const getTemplate = (templateId: string) => {
    const templates = useSyncStore.getState().templates
    // console.log('getTemplate', { templates, nodeIntents })

    const template = templates.find((t) => t.id === templateId)
    if (template) return template
    return undefined
  }

  const getIntents = (id: string, templateId: string) => {
    const template = getTemplate(templateId)
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
      } else {
        addIntentEmptyMap(id)
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

  const updateNodeIntents = (id: string, changedIntents: Intent[]) => {
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[id]
    const leftIntents: Intent[] = [...changedIntents]
    const updatedIntents = nodeIntents.intents.map((i) => {
      const newIntent = changedIntents.find((ni) => ni.service === i.service)
      if (newIntent) {
        leftIntents.splice(changedIntents.indexOf(newIntent))
        return newIntent
      } else {
        return i
      }
    })

    const intents = [...updatedIntents, ...leftIntents]
    console.log({ nodeIntents, newIntents: updatedIntents, leftIntents, intents, changedIntents })
    const groups: { [igid: string]: IntentGroup } = {}
    Object.keys(nodeIntents.intentGroups).forEach((k) => {
      const intentGroup = nodeIntents.intentGroups[k]
      const igintents = intentGroup.intents.map((i) => {
        const newIntent = intents.find((ni) => ni.service === i.service)
        if (newIntent) {
          return newIntent
        } else {
          return i
        }
      })
      groups[k] = {
        templateId: intentGroup.templateId,
        intents: igintents
      }
    })

    console.log({ groups })

    updateIntentsAndIGIDs(id, {
      intents,
      intentGroups: groups
    })
  }

  return { getIntents, getTemplate, getIntentGroupId, checkAndGenerateIGID, getNodeIntents, updateNodeIntents }
}

export default useIntents
