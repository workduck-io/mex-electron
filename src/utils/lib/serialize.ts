// import { generateTempId } from '../Defaults/idPrefixes'
import { ELEMENT_TODO_LI } from '@editor/Components/Todo/createTodoPlugin'
import { TodoType } from '@editor/Components/Todo/types'
import { useAuthStore } from '@services/auth/useAuth'

import { generateTempId } from '../../data/Defaults/idPrefixes'
import { mog } from './helper'
import { extractMetadata } from './metadata'

// const ElementsWithProperties = [ELEMENT_PARAGRAPH]
// const ElementsWithURL = [ELEMENT_LINK, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED]

// Direct properties are collated in the properties for api
// and then unfurled when converting back to editor content
const directPropertyKeys = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'highlight',
  'code',
  'email',
  'url',
  'caption',
  'value',
  'blockValue',
  'checked',
  'blockId',
  'body',
  'align',
  'questionId',
  'question',
  'answer',
  'actionContext',
  'blockMeta',
  'entityId'
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
export const serializeContent = (content: any[], nodeid: string) => {
  return content.map((el) => {
    if (Object.keys(serializeSpecial).includes(el.type)) {
      return serializeSpecial[el.type](el, nodeid)
    }
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
      nl.children = serializeContent(el.children, nodeid)
    }

    return nl
  })
}

export const serializeSpecial: { [elementType: string]: (element: any, nodeid: string) => any } = {
  ilink: (el: any, nodeid: string) => {
    const workspaceDetails = useAuthStore.getState().workspaceDetails
    if (el.blockId)
      return {
        elementType: 'blockILink',
        blockID: el.blockId,
        blockAlias: el.blockValue,
        nodeID: el.value,
        id: el.id ?? generateTempId(),
        workspaceID: workspaceDetails.id
      }
    else
      return {
        elementType: 'nodeILink',
        nodeID: el.value,
        id: el.id ?? generateTempId(),
        workspaceID: workspaceDetails.id
      }
  },
  a: (el: any, nodeid: string) => {
    return {
      elementType: 'webLink',
      url: el.url,
      id: el.id ?? generateTempId(),
      children: serializeContent(el.children ?? [], nodeid)
    }
  },
  [ELEMENT_TODO_LI]: (el: any, nodeid: string) => {
    return {
      id: el.id || generateTempId(),
      elementType: el.type,
      properties: {
        entityId: el.entityId
      }
    }
  }
}

export const deserializeSpecial: { [elementType: string]: (element: any) => any } = {
  nodeILink: (el: any) => {
    return {
      type: 'ilink',
      value: el.nodeID,
      id: el.id,
      children: [{ text: '', id: generateTempId() }]
    }
  },
  blockILink: (el: any) => {
    return {
      type: 'ilink',
      value: el.nodeID,
      blockId: el.blockID,
      blockValue: el.blockAlias,
      id: el.id,

      children: [{ text: '', id: generateTempId() }]
    }
  },
  webLink: (el: any) => {
    return {
      type: 'a',
      url: el.url,
      id: el.id,

      children: el?.children ? deserializeContent(el?.children) : [{ text: '', id: generateTempId() }]
    }
  }
}

// * For: TODO
export const serializeTodo = (todo: TodoType) => {
  const updatedTodo = {
    entityId: todo.entityId,
    nodeId: todo.nodeid,
    content: todo.content,
    properties: todo.entityMetadata
  }

  return todo.type ? { ...updatedTodo, type: todo.type } : updatedTodo
}

export const deserializeTodos = (todos) => {
  return todos.map((todo) => {
    const { properties, created, modified, nodeId, ...restTodo } = todo

    return {
      ...restTodo,
      createdAt: created,
      updatedAt: modified,
      entityMetadata: properties,
      nodeid: nodeId
    }
  })
}

// From API to content
export const deserializeContent = (sanatizedContent: any[]) => {
  return sanatizedContent.map((el) => {
    if (Object.keys(deserializeSpecial).includes(el.elementType)) {
      const dEl = deserializeSpecial[el.elementType](el)
      return dEl
    }
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
      const elProps = { ...el.properties }
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
      nl.text = el.content || ''
    }

    return nl
  })
}
