import { getSystemTagsFromLinks } from './systemTags'
import { ELEMENT_ILINK } from './../../editor/Components/ilink/defaults'
import { ELEMENT_LINK, ELEMENT_TODO_LI, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED } from '@udecode/plate'
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw'
import { ELEMENT_TAG } from '../../editor/Components/tag/defaults'
import { NodeEditorContent } from '../../types/Types'
import { NodeAnalysis, OutlineItem } from './../../store/useAnalysis'
import { convertContentToRawText } from '../search/parseData'

const ELEMENTS_IN_OUTLINE: { [key: string]: number } = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 }

const SYSTEM_TAGS = {
  ELEMENT_LINK: 'Link',
  ELEMENT_IMAGE: 'Image',
  ELEMENT_TODO_LI: 'Todo',
  ELEMENT_MEDIA_EMBED: 'MediaEmbed',
  ELEMENT_EXCALIDRAW: 'Excalidraw',
  ELEMENT_ILINK: 'InternalLink'
}

const URL_REGEX_PATTERN =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
const URL_REGEX = RegExp(URL_REGEX_PATTERN)

export const parseContentsForAnalysis = (content: any[]): { [key: string]: Set<string | OutlineItem> } => {
  const elements: { [key: string]: Set<string | OutlineItem> } = {
    tags: new Set<string>(),
    systemTags: new Set<string>(),
    urls: new Set<string>(),
    outline: new Set<OutlineItem>(),
    ilinks: new Set<string>()
  }

  content.forEach((block) => {
    // Parse block for
    switch (block.type) {
      case 'tag':
      case ELEMENT_TAG: {
        elements.tags.add(block.value)
        break
      }

      case 'a':
      case ELEMENT_LINK: {
        elements.systemTags.add(SYSTEM_TAGS.ELEMENT_LINK)
        elements.urls.add(block.url)
        break
      }

      case 'img':
      case ELEMENT_IMAGE: {
        elements.systemTags.add(SYSTEM_TAGS.ELEMENT_IMAGE)

        const url: string = block.url
        if (url.match(URL_REGEX)) elements.urls.add(url)
        break
      }

      case 'media_embed':
      case ELEMENT_MEDIA_EMBED: {
        elements.systemTags.add(SYSTEM_TAGS.ELEMENT_MEDIA_EMBED)
        elements.urls.add(block.url)
        break
      }

      case ELEMENT_EXCALIDRAW: {
        elements.systemTags.add(SYSTEM_TAGS.ELEMENT_EXCALIDRAW)
        break
      }

      case ELEMENT_TODO_LI: {
        elements.systemTags.add(SYSTEM_TAGS.ELEMENT_TODO_LI)
        break
      }

      case 'ilink':
      case ELEMENT_ILINK: {
        elements.systemTags.add(SYSTEM_TAGS.ELEMENT_ILINK)
        elements.ilinks.add(block.value)
      }
    }

    // Recursively run for children of the current block
    if (block.children && block.children.length > 0) {
      const childrenElements = parseContentsForAnalysis(block.children)
      Object.keys(elements).forEach((element) => {
        childrenElements[element].forEach((e) => elements[element].add(e))
      })
    }

    if (block && block.type && ELEMENTS_IN_OUTLINE[block.type.toLowerCase()]) {
      const title = convertContentToRawText(block.children, ' ')
      if (title.trim() !== '')
        elements.outline.add({
          type: block.type,
          title: title,
          id: block.id,
          level: ELEMENTS_IN_OUTLINE[block.type]
        })
    }
  })
  return elements
}

export const getElementsFromContent = (content: NodeEditorContent): NodeAnalysis => {
  const elements = parseContentsForAnalysis(content)

  const keys = ['tags', 'systemTags', 'urls', 'outline', 'ilinks']
  const analysis = {
    tags: [],
    systemTags: [],
    urls: [],
    outline: [],
    ilinks: []
  }

  keys.forEach((k) => {
    analysis[k] = [...elements[k]]
  })

  const sysTagsFromLinks = getSystemTagsFromLinks(analysis.urls)
  analysis.systemTags = [...analysis.systemTags, ...sysTagsFromLinks]
  return analysis
}

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

  return [...new Set(tags)]
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
