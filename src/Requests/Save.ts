import { RestAPI as API } from '@aws-amplify/api-rest'
import axios from 'axios'
import { WORKSPACE_ID } from '../Defaults/auth'
import { defaultContent } from '../Defaults/baseData'
import { USE_API } from '../Defaults/dev_'
import { getAuthConfig } from '../Hooks/useAuth/useAuth'
import { deserializeContent, serializeContent } from '../Lib/serialize'
import initializeAmplify from './amplify/init'
import { apiUrls } from './routes'

initializeAmplify()

export const saveDataAPI = (uid: string, content: any[]) => {
  if (!USE_API) return
  const reqData = {
    id: uid,
    namespaceIdentifier: 'NAMESPACE1',
    workspaceIdentifier: WORKSPACE_ID,
    data: serializeContent(content ?? defaultContent)
  }

  API.post('mex', '/node', {
    body: reqData
  })
    // .then(() => {
    //   console.log('Post data', { content, data: reqData.data })
    //   console.log('Desanatized', { dC: JSON.stringify(desanatizedContent(reqData.data)) })
    // })
    .catch((e) => {
      console.error(e)
    })
}

const testPerf = async (uid: string, config: any) => {
  const ar = Array.from(Array(100).keys())
  let lost = 0
  // const t0 = performance.now()
  // await Promise.all(
  //   ar.map(async (e) => {
  //     const data = await axios
  //       .get(`https://mvvr3lsvob.execute-api.us-east-1.amazonaws.com/node/${uid}`, config)
  //       .catch(() => {
  //         lost++
  //       })
  //   })
  // )
  // const t1 = performance.now()
  // console.log('Parallel Performance', {
  //   time: t1 - t0,
  //   t1,
  //   t0,
  //   lost,
  //   avg: (t1 - t0) / ar.length,
  // })

  const t01 = performance.now()
  lost = 0
  await ar
    .reduce((seq, n) => {
      return seq
        .then(async () => {
          await axios.get(`https://mvvr3lsvob.execute-api.us-east-1.amazonaws.com/node/${uid}`, config)
        })
        .catch((e) => {
          lost++
        })
    }, Promise.resolve())
    .then(() => console.log('Finished'))

  const t11 = performance.now()
  console.log('Linear Performance', {
    time: t11 - t01,
    t11,
    t01,
    lost,
    avg: (t11 - t01) / (ar.length - lost)
  })
}

export const getDataAPI = async (uid: string) => {
  const data = await axios.get(apiUrls.getNode(uid), getAuthConfig()).then((d) => {
    return d.data.data
  })

  const dd = deserializeContent(data)

  // console.log('API DATA', { data, dd })
  // testPerf(uid)

  return dd
}
