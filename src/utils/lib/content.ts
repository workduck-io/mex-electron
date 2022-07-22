import { ELEMENT_MENTION } from '@editor/Components/mentions/defaults'
import { ELEMENT_TODO_LI } from '@udecode/plate'
import { uniq } from 'lodash'
import { generateTempId } from '../../data/Defaults/idPrefixes'
import { ELEMENT_TAG } from '../../editor/Components/tag/defaults'
import { NodeEditorContent } from '../../types/Types'
import { mog } from './helper'

export const getTagsFromContent = (content: any[]): string[] => {
  let tags: string[] = []

  content.forEach((n) => {
    if (n.type === 'tag' || n.type === ELEMENT_TAG) {
      tags.push(n.value)
    }
    if (n.children && n.children.length > 0) {
      tags = tags.concat(getTagsFromContent(n.children))
    }
  })

  return uniq(tags)
}

export const getMentionsFromContent = (content: any[]): string[] => {
  let mentions: string[] = []

  content.forEach((n) => {
    if (n.type === ELEMENT_MENTION) {
      // mog('mention in content', { n })
      mentions.push(n.value)
    }
    if (n.children && n.children.length > 0) {
      mentions = mentions.concat(getMentionsFromContent(n.children))
    }
  })

  return uniq(mentions)
}

export const getTodosFromContent = (content: NodeEditorContent): NodeEditorContent => {
  const todos: NodeEditorContent = []

  content.forEach((n) => {
    if (n.type === ELEMENT_TODO_LI) {
      todos.push(n)
    }
  })

  return todos
}

// Inserts temporary ids to all elements
export const insertId = (content: any[]) => {
  if (content.length === 0) {
    return content
  }
  return content.map((item) => {
    if (item.children) item.children = insertId(item.children)
    return {
      ...item,
      id: generateTempId()
    }
  })
}

// Removes existing element IDs
export const removeId = (content: any[]) => {
  if (content.length === 0) {
    return content
  }
  return content.map((item) => {
    if (item.children) item.children = removeId(item.children)
    if (item.id) delete item.id
    return item
  })
}
