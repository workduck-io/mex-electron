import Fuse from 'fuse.js'
import { FileData, NodeSearchData } from '../Types/data'

export function createFuse (initList: NodeSearchData[], overrideOptions?: Fuse.IFuseOptions<NodeSearchData>) {
  const options: Fuse.IFuseOptions<NodeSearchData> = {
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    keys: ['text'],
    ...overrideOptions
  }

  const fuse = new Fuse(initList, options)

  return fuse
}

export const convertDataToRawText = (data: FileData): NodeSearchData[] => {
  const result: NodeSearchData[] = []
  Object.entries(data.contents).forEach(([k, v]) => {
    const stringsArray: string[] = []
    if (v.type === 'editor' && k !== '__null__') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values<any>(v.content[0].children).forEach((e) => {
        if (e.text && e.text !== '') stringsArray.push(e.text)
      })
      const temp: NodeSearchData = { nodeUID: k, text: stringsArray.join('') }
      result.push(temp)
    }
  })
  return result
}
