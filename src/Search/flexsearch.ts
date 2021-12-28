import { Document } from 'flexsearch'
import { NodeSearchData } from '../Types/data'

export const createFlexsearchIndex = (initList: NodeSearchData[], indexData: any) => {
  const options = {
    document: {
      id: 'nodeUID',
      index: ['title', 'text']
    },
    tokenize: 'full'
  }

  const index = Document(options)

  if (indexData) {
    // console.log('Using Prebuilt Index!')
    Object.entries(indexData).forEach(([key, data]) => {
      // console.log('Key is: ', key)
      index.import(key, data ?? null)
    })
  } else {
    // console.log('Fresh building Index')
    initList.forEach((i) => index.add(i))
  }
  return index
}

export const flexIndexKeys = [
  'title.cfg',
  'title.ctx',
  'title.map',
  'text.cfg',
  'text.ctx',
  'text.map',
  'reg',
  'store',
  'tag'
]
