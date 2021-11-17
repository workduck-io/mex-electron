import { MEX_TAG } from '../Defaults/auth'

export const BASE_INTEGRATION_URL = 'https://http.workduck.io/integration'

export const integrationURLs = {
  createTemplate: `${BASE_INTEGRATION_URL}/sync/template`,
  getIntentValues: `${BASE_INTEGRATION_URL}/intents/value`,
  listen: (param: string) => `${BASE_INTEGRATION_URL}/listen?${param}`,
  intentGroup: (isNew: boolean) => `${BASE_INTEGRATION_URL}/sync/intent/multiple?isNew=${isNew ? 'true' : 'false'}`,
  getWorkspaceAuth: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/auth`,
  getAllServiceData: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/services/all`
}

export const BASE_API_URL = 'https://http.workduck.io/mex'
export const BASE_USER_URL = 'https://http.workduck.io/user'

export const apiURLs = {
  saveNode: `${BASE_API_URL}/node`,
  getNode: (uid: string) => `${BASE_API_URL}/node/${uid}`,
  getUserRecords: (userId: string) => `${BASE_USER_URL}/user/${userId}/${MEX_TAG}`,
  registerUser: `${BASE_API_URL}/user/register`,
  createWorkspace: `${BASE_API_URL}/workspace`,
  getNodesByWorkspace: (workspaceId: string) => `${BASE_API_URL}/node/workspace/${workspaceId}/namespace/NAMESPACE1`,
  getWorkspace: (workspace_id: string) => `${BASE_API_URL}/workspace/${workspace_id}`
}
