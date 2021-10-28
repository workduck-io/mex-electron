import Fuse from 'fuse.js'
import { createFuse } from '../Lib/localSearch'
import { NodeSearchData } from '../Types/data'

export const useLocalSearch = () => {
  let fuse: Fuse<NodeSearchData>

  const initFuse = (initList: NodeSearchData[], overrideOptions?: Fuse.IFuseOptions<NodeSearchData>) => {
    fuse = createFuse(initList, overrideOptions)
  }

  const addDoc = (doc: NodeSearchData) => {
    fuse.add(doc)
  }

  const addMultipleDocs = (docs: NodeSearchData[]) => {
    docs.forEach((doc) => addDoc(doc))
  }

  const removeDoc = (doc: NodeSearchData) => {
    fuse.remove((i) => i === doc)
  }

  const updateDoc = (oldDoc: NodeSearchData, newDoc: NodeSearchData) => {
    removeDoc(oldDoc)
    addDoc(newDoc)
  }

  const searchFuse = (query: string) => {
    return fuse.search(query)
  }

  return { initFuse, addDoc, addMultipleDocs, removeDoc, updateDoc, searchFuse }
}
