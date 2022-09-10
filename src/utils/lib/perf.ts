import { isEqual } from 'lodash'
import { useContentStore } from '../../store/useContentStore'
import { NodeEditorContent } from '../../types/Types'

export const measureTimeAsync = async (func: () => Promise<any>): Promise<number> => {
  const start = performance.now()
  return await func().then((val) => {
    const end = performance.now()
    console.log('mTime', { val }, `${end - start}ms`)
    return end - start
  })
}

export const measureTime = (func: () => any): number => {
  const start = performance.now()
  const res = func()
  const end = performance.now()
  console.log('mTime', { res }, `${end - start}ms`)
  return end - start
}

export const measureHash = async (compContent: NodeEditorContent): Promise<number> => {
  const contents = useContentStore.getState().contents
  const contentsNodeid = Object.entries(contents).map(([nodeid, content]) => ({ nodeid, content: content.content }))

  const hash = await measureTimeAsync(async () => {
    await Promise.all(
      contentsNodeid.map(async ({ nodeid, content }) => {
        const res = isEqual(content, compContent)
        console.log('compRes', { nodeid, content, res })
        return res
        // return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(content)))
      })
    ).then((val) => {
      console.log('hashVal', { val })
    })
  })

  console.log('hash', { hash })
  return 1
}
