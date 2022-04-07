// import { generateTempId } from '../Defaults/idPrefixes'

import { extractMetadata } from './metadata'
import { generateTempId } from '../../data/Defaults/idPrefixes'

// const ElementsWithProperties = [ELEMENT_PARAGRAPH]
// const ElementsWithURL = [ELEMENT_LINK, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED]

// Direct properties are collated in the properties for api
// and then unfurled when converting back to editor content
const directPropertyKeys = [
  'bold',
  'italic',
  'underline',
  'highlight',
  'code',
  'url',
  'value',
  'blockValue',
  'checked',
  'blockId',
  'body',
  'questionId',
  'question'
]
const PropKeysArray = [...directPropertyKeys] as const
type PropKeys = typeof PropKeysArray[number]
type DirectProperties = Record<PropKeys, boolean | string>

// Keys that will be replicated as is
const directKeys = []

// Keys that will be mapped to different key
const mappedKeys = {
  text: 'content'
}

// From content to api
export const serializeContent = (content: any[]) => {
  return content.map((el) => {
    const nl: any = {}
    const directProperties: DirectProperties = {}

    if (el.id) {
      nl.id = el.id
    } else {
      nl.id = generateTempId()
    }

    if (el.type) {
      if (el.type !== 'paragraph') {
        nl.elementType = el.type
      }
    }

    Object.keys(el).forEach((k) => {
      if (directPropertyKeys.includes(k)) {
        directProperties[k] = el[k]
      } else if (directKeys.includes(k)) {
        nl[k] = el[k]
      } else if (mappedKeys[k] !== undefined) {
        nl[mappedKeys[k]] = el[k]
      }
    })

    const nlproperties = {
      ...directProperties,
      ...el.properties
    }

    if (Object.keys(nlproperties).length > 0) {
      nl.properties = nlproperties
    }

    if (el.children) {
      nl.children = serializeContent(el.children)
    }

    return nl
  })
}

// From API to content
export const deserializeContent = (sanatizedContent: any[]) => {
  return sanatizedContent.map((el) => {
    const nl: any = {}

    if (el.elementType !== 'paragraph' && el.elementType !== undefined) {
      nl.type = el.elementType
    }

    if (el.id !== undefined) {
      nl.id = el.id
    }

    nl.metadata = extractMetadata(el)

    // Properties
    if (el.properties) {
      const elProps = el.properties
      Object.keys(el.properties).forEach((k) => {
        if (directPropertyKeys.includes(k)) {
          nl[k] = el.properties[k]
          delete elProps[k]
        }
      })

      if (Object.keys(elProps).length > 0) {
        nl.properties = elProps
      }
    }

    if (el.children && el.children.length > 0) {
      nl.children = deserializeContent(el.children ?? [])
    } else {
      nl.text = el.content
    }

    return nl
  })
}
