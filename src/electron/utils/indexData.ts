import fs from 'fs'
import path from 'path'
import { flexIndexKeys } from '../../utils/search/flexsearch'
import { isEmpty, xor } from 'lodash'

export const getIndexData = (location: string) => {
  if (!fs.existsSync(location)) return null

  const searchIndex = {}
  const keys = fs
    .readdirSync(location, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name.slice(0, -5))

  const areSame = isEmpty(xor(keys, flexIndexKeys))
  if (!areSame) return null

  for (let i = 0, key; i < keys.length; i += 1) {
    key = keys[i]
    const data = fs.readFileSync(path.join(location, `${key}.json`), 'utf8')
    searchIndex[key] = data ?? null
  }

  if (searchIndex['title.map'] === '') return null

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
