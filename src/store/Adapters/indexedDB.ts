import { get, set, del } from 'idb-keyval'
import { StateStorage } from 'zustand/middleware'

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

// Custom storage object
export const indexedDbStorageZustand: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved')
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved')
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, 'has been deleted')
    await del(name)
  }
}
