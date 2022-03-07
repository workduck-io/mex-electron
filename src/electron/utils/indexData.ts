import fs from 'fs'
import { isEmpty, xor } from 'lodash'
import path from 'path'

import { diskIndex, indexKeys, indexNames } from '../../data/search'

export const getIndexData = (location: string) => {
  const searchIndex = diskIndex
  if (!fs.existsSync(location)) return searchIndex

  Object.entries(indexKeys).forEach(([idxName, idxKeys]) => {
    const keys = fs
      .readdirSync(location, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .filter((item) => item.name.startsWith(idxName))
      // -5 in the end for the JSON file extension and idxName.length + 1 for the idxName property in the beginning of filename
      .map((item) => item.name.slice(idxName.length + 1, -5))

    const areSame = isEmpty(xor(keys, idxKeys))
    if (!areSame) searchIndex[idxName] = null

    for (let i = 0, key; i < keys.length; i += 1) {
      key = keys[i]
      const data = fs.readFileSync(path.join(location, `${idxName}.${key}.json`), 'utf8')
      searchIndex[idxName][key] = data ?? null
    }

    // console.log(`\n====\n Indexing ${location} Positive \n====\n`, { keys, idxKeys })
    if (searchIndex[idxName]['title.map'] === '') searchIndex[idxName] = null
  })

  return searchIndex
}

export const setSearchIndexData = (index: Record<indexNames, any>, location: string) => {
  if (!fs.existsSync(location)) fs.mkdirSync(location)

  Object.entries(indexKeys).forEach(([idxName, idxKeys]) => {
    idxKeys.forEach((key) => {
      try {
        const t = path.join(location, `${idxName}.${key}.json`)
        const idxData = index[idxName][key]
        const d: any = idxData !== undefined ? idxData : '' // This is not by mistake
        fs.writeFileSync(t, JSON.stringify(d))
      } catch (err) {
        console.log('Error is: ', err)
      }
    })
  })
}
