import { RestAPI as API } from '@aws-amplify/api-rest'
import { WORKSPACE_ID } from '../Defaults/auth'
import initializeAmplify from './amplify/init'

initializeAmplify()

export const saveDataAPI = (uid: string, content: any[]) => {
  const reqData = {
    id: uid,
    namespaceIdentifier: WORKSPACE_ID,
    data: [
      {
        type: 'AdvancedElement',
        id: 'sampleParentID',
        content: 'Sample Content',
        elementType: 'list',
        childrenElements: [
          {
            type: 'BasicTextElement',
            id: 'sampleChildID',
            content: 'sample child content'
          }
        ]
      }
    ],
    createdAt: 1234,
    updatedAt: 1234
  }

  API.post('mex', '/node', {
    body: reqData
  })
    .then((d) => {
      console.log(d)
    })
    .catch((e) => {
      console.error(e)
    })
}
