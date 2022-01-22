import { uniq } from 'lodash'
import { ELEMENT_TAG } from '../editor/Components/tag/defaults'
import useDataStore from '../store/useDataStore'
import { TagsCache } from '../types/Types'

const getTagsFromContent = (content: any[]): string[] => {
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

/**
  Tags req
  - getTags(uid: string) => string[]
  - getNodesForTag(tag: string) => string[]
 **/

export interface RelatedNodes {
  [tag: string]: string[]
}

export const useTags = () => {
  // const contents = useContentStore((state) => state.contents)
  const updateTagsCache = useDataStore((state) => state.updateTagsCache)

  // const getAllLinks = () => {
  //   // We assume that all links exist
  //   const allLinks: NodeLink[] = []
  //   Object.keys(contents).forEach((key) => {
  //     const { content } = contents[key]
  //     const tags = getTagsFromContent(content)
  //     if (links.length > 0) {
  //       links.forEach((to) => {
  //         allLinks.push({
  //           from: key,
  //           to
  //         })
  //       })
  //     }
  //   })

  //   return allLinks
  // }
  //

  const _getTags = (uid: string, tagsCache: TagsCache): string[] =>
    Object.keys(tagsCache).filter((t) => tagsCache[t].nodes.includes(uid))

  const getTags = (uid: string): string[] => {
    const tagsCache = useDataStore.getState().tagsCache
    return _getTags(uid, tagsCache)
  }

  const getNodesForTag = (tag: string): string[] => {
    const tagsCache = useDataStore.getState().tagsCache
    if (tagsCache[tag]) return tagsCache[tag].nodes
    return []
  }

  /**
   * Produce a list of related nodes that share the same tags with the given node
   * The list is sorted by the number of common tags between the nodes
   * */
  const getRelatedNodes = (uid: string) => {
    const tagsCache = useDataStore.getState().tagsCache
    const tags = getTags(uid)

    /** Related nodes per tag **/
    const relatedNodes: RelatedNodes = tags.reduce((p, t) => {
      return {
        ...p,
        [t]: tagsCache[t].nodes.filter((id) => id !== uid)
      }
    }, {})

    const flattened: string[] = Object.keys(relatedNodes).reduce((p, c) => {
      return [...p, ...relatedNodes[c]]
    }, [])

    const count: { [uid: string]: number } = flattened.reduce((p, c) => {
      if (Object.keys(p).indexOf(c) > -1) {
        return {
          ...p,
          [c]: p[c] + 1
        }
      }
      return {
        ...p,
        [c]: 1
      }
    }, {})

    const relatedSorted = Array.from(new Set(flattened)).sort((a, b) => count[a] - count[b])

    // console.log('Getting relNodes for ', tagsCache, tags, ordered, flattened, relatedNodes, relatedSorted)
    return relatedSorted
  }

  const updateTagsFromContent = (uid: string, content: any[]) => {
    const tagsCache = useDataStore.getState().tagsCache

    if (content) {
      const tags: string[] = getTagsFromContent(content)
      /*
         Here we need to remove uid from tags that are not present
         and add it to those that have been added
      * */
      const currentTags = _getTags(uid, tagsCache)
      const removedFromTags = currentTags.filter((t) => {
        return !tags.includes(t)
      })

      const newTags = tags.filter((t) => {
        return !Object.keys(tagsCache).includes(t)
      })

      const updatedTags: TagsCache = Object.keys(tagsCache).reduce((p, t) => {
        const tag = tagsCache[t]
        // If it is included in tags found in content, add it
        if (tags.includes(t)) {
          const set = new Set([...tag.nodes, uid])
          return {
            ...p,
            [t]: { nodes: Array.from(set) }
          }
        }
        // If it a tag was removed, remove it from tagCache nodes
        if (removedFromTags.includes(t)) {
          const nodes = tag.nodes.filter((n) => n !== uid)
          return {
            ...p,
            [t]: { nodes }
          }
        }
        // Otherwise left untouched
        return {
          ...p,
          [t]: tag
        }
      }, {})

      const newCacheTags: TagsCache = newTags.reduce((p, t) => {
        return {
          ...p,
          [t]: { nodes: [uid] }
        }
      }, {})

      // console.log('We are updating', { uid, content, tagsCache, updatedTags, newCacheTags })
      updateTagsCache({ ...updatedTags, ...newCacheTags })
    }
  }

  return { getRelatedNodes, getNodesForTag, updateTagsFromContent, getTags }
}