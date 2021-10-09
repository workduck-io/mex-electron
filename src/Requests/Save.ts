import { RestAPI as API } from '@aws-amplify/api-rest'
import { nanoid } from 'nanoid'
import { WORKSPACE_ID } from '../Defaults/auth'
import initializeAmplify from './amplify/init'

initializeAmplify()

export const saveDataAPI = (uid: string, content: any[]) => {
  const reqData = {
    id: uid,
    namespaceIdentifier: 'NAMESPACE1',
    workspaceIdentifier: WORKSPACE_ID,
    data: sanatizedContent(content ?? [])
  }

  API.post('mex', '/node', {
    body: reqData
  })
    .then(() => {
      console.log('Post data', { content, data: reqData.data })
      console.log('Desanatized', { dC: JSON.stringify(desanatizedContent(reqData.data)) })
    })
    .catch((e) => {
      console.error(e)
    })
}

export const getDataAPI = async (uid: string) => {
  const data = await API.get('mex', `/node/${uid}`, {}).then((d) => {
    const res = JSON.parse(d.message)
    // console.log('Get data', desanatizedContent(res.data))
    return res.data
  })

  const dd = desanatizedContent(data)

  console.log('API DATA', { data, dd })

  return dd
}

export const sanatizedContent = (content: any[]) => {
  return content.map((el) => {
    return {
      id: el.id ?? `TEMP_${nanoid()}`,
      elementType: el.type ?? undefined,
      url: el.url ?? undefined,
      content: el.text ?? '',
      properties: el.properties ?? undefined,
      childrenElements: sanatizedContent(el.children ?? [])
    }
  })
}

export const desanatizedContent = (sanatizedContent: any[]) => {
  return sanatizedContent.map((el) => {
    const nl: any = {}
    if (el.elementType !== 'paragraph' && el.elementType !== undefined) {
      nl.type = el.elementType
    }

    if (el.id !== undefined) {
      nl.id = el.id
    }

    if (el.url !== undefined) {
      nl.url = el.url
    }

    if (el.properties !== undefined) {
      nl.properties = el.properties
    }

    if (el.childrenElements && el.childrenElements.length > 0) {
      nl.children = desanatizedContent(el.childrenElements ?? [])
    } else {
      nl.text = el.content
    }

    return nl
  })
}
