import { get, set } from 'idb-keyval'

export const indexedDBStorage = {
  getItem: async (name) => {
    if (typeof indexedDB === 'undefined') {
      return null
    }

    const value = await get(name)

    console.log('load indexeddb called')
    return value || null
  },
  setItem: async (name, value) => {
    if (typeof indexedDB === 'undefined') {
      return
    }
    set(name, value)
  }
}
