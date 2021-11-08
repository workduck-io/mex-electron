import { ipcRenderer } from 'electron'
import { IpcAction } from '../Spotlight/utils/constants'
import { Heap, EventProperties, UserProperties } from './types'

const useAnalytics = () => {
  const heap: Heap = global.heap

  /** Not heap's userId */
  const identifyUser = (id: string | undefined) => {
    if (id) heap.identify(id)
  }

  /** For this cookies are required */
  const addUserProperties = (properties: UserProperties) => {
    heap.addUserProperties(properties)
  }

  const addEventProperties = (properties: EventProperties) => {
    heap.clearEventProperties()
    heap.addEventProperties(properties)
  }

  const trackEvent = (name: string, properties?: Record<string, any>) => {
    heap.track(name, properties)
  }

  const initAnalytics = () => {
    /** For sync */
  }

  return {
    identifyUser,
    addUserProperties,
    initAnalytics,
    addEventProperties,
    trackEvent
  }
}

export default useAnalytics
