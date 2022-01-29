import { client } from '@workduck-io/dwindle'
import { integrationURLs } from '../apis/routes'
import { generateIgId } from '../data/Defaults/idPrefixes'
import { Intent, IntentGroup, IntentTemplate } from '../editor/Components/SyncBlock'
import { useAuthStore } from '../services/auth/useAuth'
import { useSyncStore } from '../store/useSyncStore'
import { isIntent } from '../utils/lib/intents'

const useIntents = () => {
  const addIgid = useSyncStore((store) => store.addIgid)
  const addIntentEmptyMap = useSyncStore((store) => store.addIntentEmptyMap)
  const updateIntentsAndIGIDs = useSyncStore((store) => store.updateIntentsAndIGIDs)

  const checkAndGenerateIGID = (nodeid: string, templateId: string): string => {
    const templates = useSyncStore.getState().templates
    const template = templates.find((t) => t.id === templateId)

    if (template) {
      const blockIntents: (Intent | IntentTemplate | undefined)[] = extractIntentsFromTemplate(template.intents, nodeid)

      // console.log('checkAndGenerateIGID', { template, blockIntents })
      if (blockIntents) {
        const areAllIntentsPresent = blockIntents.reduce((prev, cur) => {
          if (isIntent(cur)) return prev && true
          else return false
        }, true)

        if (areAllIntentsPresent) {
          const igid = getIntentGroupId(nodeid, templateId)

          if (igid) return igid
          else {
            // return undefined
            // console.log({ areAllIntentsPresent, blockIntents, igid })

            const newIgid = generateIgId()
            apiCreateIntent(blockIntents as Intent[], newIgid, templateId)
            addIgid(nodeid, newIgid, blockIntents as Intent[], templateId)
            // console.log({ nodeid, newIgid, blockIntents, templateId })
            return newIgid
          }
        } else {
          return undefined
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
    nodeid: string
  ): (Intent | IntentTemplate | undefined)[] => {
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[nodeid]
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
    addIntentEmptyMap(nodeid)
    return templateIntents.map(() => undefined)
  }

  const getTemplate = (templateId: string) => {
    const templates = useSyncStore.getState().templates
    // console.log('getTemplate', { templates, nodeIntents })

    const template = templates.find((t) => t.id === templateId)
    if (template) return template
    return undefined
  }

  const getIntents = (nodeid: string, templateId: string) => {
    const template = getTemplate(templateId)
    if (template) {
      const templateIntents = template.intents
      return extractIntentsFromTemplate(templateIntents, nodeid)
    }
    return undefined
  }

  const getNodeIntents = (nodeid: string) => {
    const StoreIntents = useSyncStore.getState().intents
    const StoreServices = useSyncStore.getState().services
    const nodeIntents = StoreIntents[nodeid]

    const mappedIntents = StoreServices.filter((s) => s.enabled).map((s) => {
      if (nodeIntents) {
        const intent = nodeIntents.intents.find((i) => i.service === s.id)
        return { intent, service: s }
      } else {
        addIntentEmptyMap(nodeid)
      }
      return { intent: undefined, service: s }
    })

    return mappedIntents
  }

  const getIntentGroupId = (nodeid: string, templateId: string) => {
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[nodeid]
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

  const getUpdatedIntents = (nodeid: string, changedIntents: Intent[]) => {
    const StoreIntents = useSyncStore.getState().intents
    const nodeIntents = StoreIntents[nodeid]
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

  const updateNodeIntents = (nodeid: string, changedIntents: Intent[]) => {
    const { intents, groups } = getUpdatedIntents(nodeid, changedIntents)
    // console.log({ groups })

    Object.keys(groups).forEach((k) => {
      const group = groups[k]
      apiUpdateIntent(group.intents, k)
    })

    updateIntentsAndIGIDs(nodeid, {
      intents,
      intentGroups: groups
    })
  }

  const updateNodeIntentsAndCreateIGID = (nodeid: string, changedIntents: Intent[], templateId: string) => {
    const { intents, groups } = getUpdatedIntents(nodeid, changedIntents)

    const template = getTemplate(templateId)
    const igidIntents = findIntentsFromIntentTemplate(template.intents, intents)

    const newIgid = generateIgId()
    groups[newIgid] = {
      intents: igidIntents,
      templateId
    }

    // console.log({ groups })

    apiCreateIntent(igidIntents, newIgid, templateId)

    updateIntentsAndIGIDs(nodeid, {
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

const apiCreateIntent = (intents: Intent[], igid: string, templateId: string) => {
  const syncDetails = intents.map((i: Intent) => ({
    service: i.service,
    intentType: i.type,
    intentVal: i.value,
    isActive: 'true',
    options: i.options
  }))
  const reqData = {
    intentGroupId: igid,
    workspaceId: useAuthStore.getState().workspaceDetails.id,
    templateId: templateId,
    syncDetails: syncDetails
  }
  // console.log({ reqData })

  client.post(integrationURLs.intentGroup(true), reqData)
}

const apiUpdateIntent = (intents: Intent[], igid: string) => {
  const syncDetails = intents.map((i: Intent) => ({
    service: i.service,
    intentType: i.type,
    intentVal: i.value,
    isActive: 'true',
    options: i.options
  }))
  const reqData = {
    intentGroupId: igid,
    workspaceId: useAuthStore.getState().workspaceDetails.id,
    syncDetails: syncDetails
  }
  // console.log({ reqData })

  client.post(integrationURLs.intentGroup(false), reqData)
}

export default useIntents

const findIntentsFromIntentTemplate = (intentTemplates: IntentTemplate[], intents: Intent[]) => {
  const blockIntents = intentTemplates.map((it) => {
    const corespondingIntent = intents.find((i) => i.service === it.service)
    return corespondingIntent
  })
  return blockIntents
}
