import fs from 'fs'
import { isEmpty, xor } from 'lodash'
import path from 'path'

import { flexIndexKeys } from '../../utils/search/flexsearch'
import { SearchIndex } from './../../store/useSearchStore'
import { indexKeys, diskIndex } from '../../data/search'

export const getIndexData = (location: string) => {
  if (!fs.existsSync(location)) return null

  const searchIndex = diskIndex

  Object.entries(indexKeys).forEach(([idxName, idxKeys]) => {
    const keys = fs
      .readdirSync(location, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .filter((item) => item.name.startsWith(idxName))
      .map((item) => item.name.slice(idxName.length + 1, -5)) // for the .json file extension

    const areSame = isEmpty(xor(keys, idxKeys))
    if (!areSame) return null

    for (let i = 0, key; i < keys.length; i += 1) {
      key = keys[i]
      const data = fs.readFileSync(path.join(location, `${idxName}.${key}.json`), 'utf8')
      searchIndex[idxName][key] = data ?? null
    }

    if (searchIndex[idxName]['title.map'] === '') searchIndex[idxName] = null
  })

  return searchIndex
}

export const setSearchIndexData = (index, location: string) => {
  if (!fs.existsSync(location)) fs.mkdirSync(location)

  Object.entries(index).forEach(([key, data]) => {
    try {
      const t = path.join(location, `${key}.json`)
      const d: any = data !== 'undefined' ? data : ''
      fs.writeFileSync(t, d)
    } catch (err) {
      console.log('Error is: ', err)
    }
  })
}
