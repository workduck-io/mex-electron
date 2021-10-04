import axios from 'axios'
import { nanoid } from 'nanoid'
import { WORKSPACE_ID } from '../../Defaults/auth'
import { Intent, IntentGroup, IntentTemplate } from '../../Editor/Components/SyncBlock/SyncBlock.types'
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
          const newIgid = `INTENTGROUP_${nanoid()}`
          if (filteredBlockIntents.length === blockIntents.length) {
            apiCreateIntent(filteredBlockIntents, newIgid, templateId)
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

  const getUpdatedIntents = (id: string, changedIntents: Intent[]) => {
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
    // console.log({ nodeIntents, newIntents: updatedIntents, leftIntents, intents, changedIntents })
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

    // console.log({ groups })

    return {
      intents,
      groups
    }
  }

  const updateNodeIntents = (id: string, changedIntents: Intent[]) => {
    const { intents, groups } = getUpdatedIntents(id, changedIntents)
    // console.log({ groups })

    updateIntentsAndIGIDs(id, {
      intents,
      intentGroups: groups
    })
  }

  const updateNodeIntentsAndCreateIGID = (id: string, changedIntents: Intent[], templateId: string) => {
    const { intents, groups } = getUpdatedIntents(id, changedIntents)

    const template = getTemplate(templateId)
    const igidIntents = findIntentsFromIntentTemplate(template.intents, intents)

    const newIgid = `INTENTGROUP_${nanoid()}`
    groups[newIgid] = {
      intents: igidIntents,
      templateId
    }

    console.log({ groups })

    apiCreateIntent(igidIntents, newIgid, templateId)

    updateIntentsAndIGIDs(id, {
      intents,
      intentGroups: groups
    })

    return newIgid
  }

  return {
    getIntents,
    getTemplate,
    getIntentGroupId,
    checkAndGenerateIGID,
    getNodeIntents,
    updateNodeIntents,
    updateNodeIntentsAndCreateIGID
  }
}

const apiCreateIntent = (intents: Intent[], igid: string, templateId) => {
  const syncDetails = intents.map((i: Intent) => ({
    service: i.service,
    intentType: i.type,
    intentVal: i.value,
    isActive: 'true'
  }))
  const reqData = {
    intentGroupId: igid,
    workspaceId: WORKSPACE_ID,
    templateId: templateId,
    syncDetails: syncDetails
  }
  console.log({ reqData })

  axios.post('http://802e-106-200-236-145.ngrok.io/local/sync/intent/multiple?isNew=true', reqData)
}

export default useIntents

const findIntentsFromIntentTemplate = (intentTemplates: IntentTemplate[], intents: Intent[]) => {
  const blockIntents = intentTemplates.map((it) => {
    const corespondingIntent = intents.find((i) => i.service === it.service)
    return corespondingIntent
  })
  return blockIntents
}
