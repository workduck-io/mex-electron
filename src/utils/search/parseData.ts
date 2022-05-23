// import { FileData, NodeSearchData } from '../Types/data'

import { indexNames, diskIndex } from '../../data/search'
import { useContentStore } from '../../store/useContentStore'
import { FileData } from '../../types/data'
import { getBlocks } from '../helpers'
import { GenericSearchData } from './../../types/search'
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw'
import { NodeEditorContent } from '../../types/Types'
import { getSlug } from '../lib/strings'
import { ELEMENT_QA_BLOCK } from '../../editor/Components/QABlock/createQAPlugin'
import { ELEMENT_ILINK } from '../../editor/Components/ilink/defaults'
import { ELEMENT_INLINE_BLOCK } from '../../editor/Components/InlineBlock/types'
import {
  ELEMENT_MEDIA_EMBED,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI,
  ELEMENT_LINK,
  ELEMENT_IMAGE,
  ELEMENT_CODE_BLOCK
} from '@udecode/plate'
import { BlockType } from '../../store/useBlockStore'
// import { mog } from '../lib/helper'
import { ELEMENT_MENTION } from '@editor/Components/mentions/defaults'

type ExcludeFromTextType = {
  types?: Set<string>
  fields?: Set<ExcludeFieldTypes>
}

type ExcludeFieldTypes = 'value' | 'url' | 'text'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (
  content: any[],
  join?: string,
  exclude: ExcludeFromTextType = {
    types: new Set([ELEMENT_EXCALIDRAW, ELEMENT_ILINK, ELEMENT_INLINE_BLOCK, ELEMENT_MENTION])
  }
): string => {
  const text: string[] = []

  content?.forEach((n) => {
    if (exclude?.types?.has(n.type)) return

    if (n.text && !exclude?.fields?.has('text') && n.text !== '') text.push(n.text)

    // * Extract custom components (ILink, Tags, etc) `value` field
    if (n.value && !exclude?.fields?.has('value') && n.value !== '') text.push(n.value)

    // * Extract custom components (Webem, Links) `url` field
    if (n.url && !exclude?.fields?.has('url') && n.url !== '') text.push(n.url)

    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children, join ?? '', exclude)
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
export const convertEntryToRawText = (nodeUID: string, entry: any[], title = ''): GenericSearchData => {
  return { id: nodeUID, title, text: convertContentToRawText(entry, ' ') }
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

export const parseNode = (nodeId: string, contents: any[], title = ''): GenericSearchData[] => {
  const result: GenericSearchData[] = []
  contents.forEach((block) => {
    if (block.type === ELEMENT_EXCALIDRAW) return

    let blockText = ''
    if (block.value && block.value !== '') blockText += `${block.value}`
    if (block.url && block.url !== '') blockText += ` ${block.url}`
    blockText += ' ' + convertContentToRawText(block.children, ' ')

    if (blockText.trim().length !== 0) {
      const temp: GenericSearchData = { id: nodeId, text: blockText, blockId: block.id, title, data: block }
      result.push(temp)
    }
  })
  return result
}

export const getTitleFromContent = (content: NodeEditorContent) => {
  const heading = getHeadingBlock(content)
  if (heading) return heading.title

  const text = convertContentToRawText(content, ' ', { fields: new Set<ExcludeFieldTypes>(['value', 'url']) })
  const title = getSlug(text)

  return title
}

export const convertDataToIndexable = (data: FileData) => {
  const nodeBlockMap: { [key: string]: string[] } = {}
  const result: Record<indexNames, GenericSearchData[]> = Object.entries(indexNames).reduce((p, c) => {
    const idxResult = []
    const idxName = c[0]
    const titleNodeMap = new Map<string, string>()

    // Pre-process the data to get the title node map
    switch (idxName) {
      case indexNames.node: {
        data.ilinks.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
        })
        break
      }

      case indexNames.archive: {
        data.archive.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
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

      default: {
        throw new Error('No corresponding index name found')
      }
    }

    // Process the filedata to get the indexable data
    if (idxName === indexNames.archive || idxName === indexNames.node) {
      Object.entries(data.contents).forEach(([k, v]) => {
        if (k !== '__null__' && titleNodeMap.has(k)) {
          if (!nodeBlockMap[k]) nodeBlockMap[k] = []
          v.content.forEach((block) => {
            const blockText = convertContentToRawText(block.children, ' ')
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
    } else if (idxName === indexNames.snippet) {
      data.snippets
        .filter((snip) => !snip.isTemplate)
        .map((snip) => {
          const title = titleNodeMap.get(snip.id)
          const temp: GenericSearchData = {
            ...convertEntryToRawText(snip.id, snip.content, title),
            tag: ['snippet']
          }
          nodeBlockMap[snip.id] = [snip.id] // Redundant right now, not doing block level indexing for snippets
          idxResult.push(temp)
        })
    } else if (idxName === indexNames.template) {
      data.snippets
        .filter((snip) => snip.isTemplate)
        .map((template) => {
          const title = titleNodeMap.get(template.id)
          const temp: GenericSearchData = {
            ...convertEntryToRawText(template.id, template.content, title),
            tag: ['template']
          }
          nodeBlockMap[template.id] = [template.id] // Redundant right now, not doing block level indexing for snippets
          idxResult.push(temp)
        })
    } else {
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
    return {
      changed: true,
      block: {
        type: ELEMENT_LINK,
        url: block.url,
        children: [{ text: '' }]
      }
    }
  }

  return { changed: false, block }
}

export const defaultCopyFilter = ({ type }) => {
  const exclude: Array<string> = [
    ELEMENT_EXCALIDRAW,
    ELEMENT_ILINK,
    ELEMENT_TABLE,
    ELEMENT_QA_BLOCK,
    ELEMENT_INLINE_BLOCK,
    ELEMENT_CODE_BLOCK
  ]
  return !exclude.includes(type)
}
