// import { FileData, NodeSearchData } from '../Types/data'
import { generateTaskEntityId } from '@data/Defaults/idPrefixes'
import { ELEMENT_ACTION_BLOCK } from '@editor/Components/Actions/types'
import { PriorityType, TodoStatus } from '@editor/Components/Todo/types'
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_IMAGE,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI
} from '@udecode/plate'
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw'
import { insertId } from '@utils/lib/content'
import { textChildren } from '@utils/lib/smallContent'

import { mog } from '@workduck-io/mex-utils'

import { HASH_SEPARATOR, SEPARATOR } from '../../data/Defaults/idPrefixes'
import { diskIndex, indexNames } from '../../data/search'
import { ELEMENT_INLINE_BLOCK } from '../../editor/Components/InlineBlock/types'
import { ELEMENT_QA_BLOCK } from '../../editor/Components/QABlock/createQAPlugin'
import { BlockType } from '../../store/useBlockStore'
import { useContentStore } from '../../store/useContentStore'
import { NodeEditorContent } from '../../types/Types'
import { FileData } from '../../types/data'
import { getBlocks } from '../helpers'
import { camelCase, getSlug } from '../lib/strings'
import { GenericSearchData, SearchRepExtra } from './../../types/search'

export const getTitleFromPath = (path: string, withNoteId = false) => {
  const separator = withNoteId ? HASH_SEPARATOR : SEPARATOR
  const titleAt = withNoteId ? -2 : -1

  return path?.split(separator)?.slice(titleAt)[0]
}

type ExcludeFromTextType = {
  types?: Set<string>
  fields?: Set<ExcludeFieldTypes>
}

type ExcludeFieldTypes = 'value' | 'url' | 'text'

type ContentConverterOptions = {
  exclude?: ExcludeFromTextType
  extra?: SearchRepExtra
}

type ReplacementFunction = (blockValue: any, keyToIndex: string) => string

const excalidraw_replacement: ReplacementFunction = (blockValue, keyToIndex) => {
  const rawValue = blockValue[keyToIndex]
  mog('RAW VALUE OF EXCALI', { rawValue })
  const parsedExcalidrawElements = JSON.parse(rawValue || '{}').elements

  const text: string[] = []

  parsedExcalidrawElements?.forEach((elem) => {
    if (elem.text && elem.text !== '') {
      text.push(elem.text)
    }
  })

  return text.join(' ')
}

const replacementFunctions: Record<string, ReplacementFunction> = {
  [ELEMENT_EXCALIDRAW]: excalidraw_replacement
}

export const getNewTodoAndBlock = (oldContent: any) => {
  const { metadata, ...restTodoBlock } = oldContent
  const { status, priority, ...restMetadata } = metadata || {}

  const entityId = generateTaskEntityId()

  return {
    newTodo: {
      ...restTodoBlock,
      entityId,
      entityMetadata: {
        status: status || TodoStatus.todo,
        priority: priority || PriorityType.noPriority
      }
    },
    newBlock: {
      ...restTodoBlock,
      entityId,
      metadata: restMetadata
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (
  content: any[],
  join?: string,
  options: ContentConverterOptions = {
    exclude: {
      types: new Set([])
    }
  }
): string => {
  const text: string[] = []
  const extraKeys = options?.extra ? Object.keys(options.extra) : []

  content?.forEach((n) => {
    if (options?.exclude?.types?.has(n.type)) return

    if (extraKeys.includes(n.type)) {
      if (options?.extra[n.type]) {
        const blockKey = options?.extra[n.type].keyToIndex
        const replacements = options?.extra[n.type].replacements

        const blockText =
          replacements === undefined ? replacementFunctions[n.type](n, blockKey) : replacements[n[blockKey]]

        if (blockText) text.push(blockText)
        return
      }
    }

    if (n.text && !options?.exclude?.fields?.has('text') && n.text !== '') text.push(n.text)

    // * Extract custom components (ILink, Tags, etc) `value` field
    if (n.value && !options?.exclude?.fields?.has('value') && n.value !== '') text.push(n.value)

    if (n.actionContext?.actionGroupId) text.push(camelCase(n.actionContext?.actionGroupId))

    // * Extract custom components (Webem, Links) `url` field
    if (n.url && !options?.exclude?.fields?.has('url') && n.url !== '') text.push(n.url)

    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children, join ?? '', options)
      text.push(childText)
    }
  })

  const rawText = text.join(join ?? '')
  return rawText
}

export const getBlock = (nodeid: string, blockId: string) => {
  const nodeContent = useContentStore.getState().getContent(nodeid)

  if (nodeContent?.content) {
    const blocksMap = getBlocks(nodeContent.content)
    if (blocksMap) {
      const blocks = Object.values(blocksMap).map((bd) => bd.block)
      if (!blocks) return undefined

      return blocks.find((b) => {
        return b?.id === blockId
      })
    }
  }

  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEntryToRawText = (
  nodeUID: string,
  entry: any[],
  title = '',
  extra?: SearchRepExtra
): GenericSearchData => {
  return { id: nodeUID, title, text: convertContentToRawText(entry, ' ', { extra }) }
}

export function updateObject<Type extends Record<string, unknown>>(
  entityObject: Type,
  fieldsToUpdate: Record<keyof Type, unknown>
): Type {
  return {
    ...entityObject,
    ...fieldsToUpdate
  }
}

export const getHeadingBlock = (content: NodeEditorContent) => {
  const isHeadingBlock = content[0].type === ELEMENT_QA_BLOCK
  if (isHeadingBlock) {
    return {
      isHeadingBlock: true,
      title: getSlug(content[0].answer ?? '')
    }
  }

  return undefined
}

export const parseNode = (nodeId: string, contents: any[], title = '', extra?: SearchRepExtra): GenericSearchData[] => {
  const result: GenericSearchData[] = []
  const extraKeys = extra ? Object.keys(extra) : []
  contents.forEach((block) => {
    if (block.type === ELEMENT_EXCALIDRAW) return

    let blockText = ''
    if (block.value && block.value !== '') blockText += `${block.value}`
    if (block.url && block.url !== '') blockText += ` ${block.url}`
    blockText += ' ' + convertContentToRawText(block.children, ' ', { extra })

    if (extraKeys.includes(block.type)) {
      if (extra[block.type]) {
        const blockKey = extra[block.type].keyToIndex
        blockText = extra[block.type].replacements[block[blockKey]]
      }
    }

    if (block.type === ELEMENT_ACTION_BLOCK) blockText = camelCase(block.actionContext?.actionGroupId)

    if (blockText?.trim().length !== 0) {
      const temp: GenericSearchData = { id: nodeId, text: blockText, blockId: block.id, title, data: block }
      result.push(temp)
    }
  })

  return result
}

export const getTitleFromContent = (content: NodeEditorContent) => {
  const heading = getHeadingBlock(content)
  if (heading) return heading.title

  const text = convertContentToRawText(content, ' ', {
    exclude: { fields: new Set<ExcludeFieldTypes>(['value', 'url']) }
  })
  const title = getSlug(text)

  return title
}

export const getTitleNodeMap = (idxName: string, data: any) => {
  const titleNodeMap = new Map<string, string>()

  // Pre-process the data to get the title node map
  switch (idxName) {
    case indexNames.node: {
      data.ilinks.forEach((entry) => {
        const nodeTitle = getTitleFromPath(entry.path ?? '')
        titleNodeMap.set(entry.nodeid, nodeTitle)
      })
      break
    }

    case indexNames.archive: {
      data.archive.forEach((entry) => {
        const nodeTitle = getTitleFromPath(entry.path ?? '')
        titleNodeMap.set(entry.nodeid, nodeTitle)
      })
      break
    }

    case indexNames.template:
    case indexNames.snippet: {
      data.snippets.forEach((snippet) => {
        titleNodeMap.set(snippet.id, snippet.title)
      })
      break
    }

    case indexNames.shared: {
      data.sharedNodes.forEach((entry) => {
        const nodeTitle = getTitleFromPath(entry.path ?? '')
        titleNodeMap.set(entry.nodeid, nodeTitle)
      })
      break
    }

    default: {
      throw new Error('No corresponding index name found')
    }
  }

  return titleNodeMap
}

export const convertDataToIndexable = (data: FileData) => {
  const nodeBlockMap: { [key: string]: string[] } = {}
  const result: Record<indexNames, GenericSearchData[]> = Object.entries(indexNames).reduce((p, c) => {
    const idxResult = []
    const idxName = c[0]

    const titleNodeMap = getTitleNodeMap(idxName, data)

    // Process the filedata to get the indexable data
    switch (idxName) {
      case indexNames.archive:
      case indexNames.node:
      case indexNames.shared:
        Object.entries(data.contents).forEach(([k, v]) => {
          if (k !== '__null__' && titleNodeMap.has(k)) {
            if (!nodeBlockMap[k]) nodeBlockMap[k] = []
            v.content.forEach((block) => {
              let blockText = convertContentToRawText(block.children, ' ')

              if (block.type === ELEMENT_ACTION_BLOCK && block?.actionContext)
                blockText = camelCase(block.actionContext?.actionGroupId)

              // If the type is init, we index the initial empty block
              if (blockText.length !== 0 || v.type === 'init') {
                nodeBlockMap[k].push(block.id)
                const temp: GenericSearchData = {
                  id: k,
                  text: blockText,
                  blockId: block.id,
                  title: titleNodeMap.get(k),
                  data: block
                }

                idxResult.push(temp)
              }
            })
          }
        })
        break

      case indexNames.snippet:
      case indexNames.template: {
        const template = idxName === indexNames.template
        data.snippets
          .filter((snip) => (template ? snip.template : !snip.template))
          .map((snip) => {
            const title = titleNodeMap.get(snip.id)
            const temp: GenericSearchData = {
              ...convertEntryToRawText(snip.id, snip.content, title),
              tag: [snip.template ? 'template' : 'snippet']
            }
            nodeBlockMap[snip.id] = [snip.id] // Redundant right now, not doing block level indexing for snippets
            idxResult.push(temp)
          })
        break
      }
      default:
        throw new Error('No corresponding index name found')
    }

    return { ...p, [idxName]: idxResult }
  }, diskIndex)

  return { result, nodeBlockMap }
}

// * Snippet Copy/Paste

type BeforeCopyOptions = {
  filter: (block: BlockType) => boolean
  converter?: (block: BlockType) => { changed: boolean; block: BlockType }
}

export const convertToCopySnippet = (
  content: Array<BlockType>,
  options: BeforeCopyOptions = { filter: defaultCopyFilter }
) => {
  return content.reduce((previousArr, block) => {
    const children = convertToCopySnippet(block.children || [], options)

    if (options.filter(block)) {
      if (options.converter) {
        const { changed, block: newBlock } = options.converter(block)
        previousArr.push(Object.assign({}, newBlock, children.length && !changed && { children }))
      } else {
        previousArr.push(Object.assign({}, block, children.length && { children }))
      }
    }

    return previousArr
  }, [])
}

export const defaultCopyConverter = (block) => {
  if (block.type === ELEMENT_TODO_LI) {
    return {
      changed: true,
      block: {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: block.children }]
          }
        ]
      }
    }
  }

  if (block.type === ELEMENT_MEDIA_EMBED || block.type === ELEMENT_IMAGE) {
    // mog('Converting Block', { block })
    return {
      changed: true,
      block: {
        type: ELEMENT_LINK,
        url: block.url,
        children: insertId(textChildren(block.url))
      }
    }
  }

  return { changed: false, block }
}

export const defaultCopyFilter = ({ type }) => {
  const exclude: Array<string> = [
    ELEMENT_EXCALIDRAW,
    // ELEMENT_ILINK,
    ELEMENT_TABLE,
    ELEMENT_QA_BLOCK,
    ELEMENT_INLINE_BLOCK,
    ELEMENT_CODE_BLOCK
  ]
  return !exclude.includes(type)
}
