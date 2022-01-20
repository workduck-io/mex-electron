import { CustomEvents } from '../../services/analytics/events'

export const capitalize = (str: string) => {
  if (!str) return ''
  return str[0].toUpperCase() + str.slice(1)
}

export const camelCase = (str: string) => {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * LOCATION - ACTION - DETAILS
 */

export const getEventNameFromElement = (location: string, action: string, elementType: string) => {
  const key = `${elementType.toUpperCase()}_${action.toUpperCase()}`
  const actionWithDetails = CustomEvents[key]

  return `${location} - ${actionWithDetails}`
}
