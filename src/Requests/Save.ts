import { RestAPI as API } from '@aws-amplify/api-rest'
import { WORKSPACE_ID } from '../Defaults/auth'
import { defaultContent } from '../Defaults/baseData'
import { USE_API } from '../Defaults/dev_'
import { deserializeContent, serializeContent } from '../Lib/serialize'
import initializeAmplify from './amplify/init'
import { client } from '@workduck-io/dwindle'
import { apiURLs } from './routes'
import { useEditorStore } from '../Editor/Store/EditorStore'

initializeAmplify()

export const useApi = () => {
  const loadNRep = useEditorStore((store) => store.loadNodeAndReplaceContent)
  const node = useEditorStore((store) => store.node)
  const saveDataAPI = (uid: string, content: any[]) => {
    const reqData = {
      id: uid,
      namespaceIdentifier: 'NAMESPACE1',
      workspaceIdentifier: WORKSPACE_ID,
      data: serializeContent(content ?? defaultContent)
    }

    // const sC = serializeContent(content)
    // const dC = deserializeContent(sC)
    // console.log('Serialized', { sC, dC, content })

    // loadNRep(node, dC)

    if (!USE_API) {
      return
    }
    client
      .post(apiURLs.saveNode, reqData, {})
      // .then(() => {
      //   console.log('Post data', { content, data: reqData.data })
      // })
      .catch((e) => {
        console.error(e)
      })
  }

  const getDataAPI = async (uid: string) => {
    const data = await client.get(apiURLs.getNode(uid), {}).then((d) => {
      // console.log('Data fetched', { data: d.data.data })
      return d.data.data
    })

    return deserializeContent(data)
  }

  return { saveDataAPI, getDataAPI }
}

const testPerf = async (uid: string) => {
  const ar = Array.from(Array(100).keys())
  const t0 = performance.now()
  let lost = 0
  await Promise.all(
    ar.map(async () => {
      await API.get('mex', `/node/${uid}`, {}).catch(() => {
        lost++
      })
    })
  )
  const t1 = performance.now()
  console.info('Parallel Performance', {
    time: t1 - t0,
    t1,
    t0,
    lost,
    avg: (t1 - t0) / ar.length
  })

  const t01 = performance.now()
  lost = 0
  await ar
    .reduce((seq) => {
      return seq
        .then(async () => {
          await API.get('mex', `/node/${uid}`, {})
        })
        .catch(() => {
          lost++
        })
    }, Promise.resolve())
    .then(() => console.info('Finished'))

  const t11 = performance.now()
  console.info('Linear Performance', {
    time: t11 - t01,
    t11,
    t01,
    lost,
    avg: (t11 - t01) / (ar.length - lost)
  })
}
