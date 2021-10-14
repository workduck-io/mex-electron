// export const BASE_URL = 'https://api.workduck.io/integration'
export const BASE_INTEGRATION_URL = 'https://1873-106-200-232-245.ngrok.io/local'
export const BASE_BACKEND_URL = 'https://mvvr3lsvob.execute-api.us-east-1.amazonaws.com'
//
export const integrationUrls = {
  createTemplate: `${BASE_INTEGRATION_URL}/sync/template`,
  getIntentValues: `${BASE_INTEGRATION_URL}/intents/value`,
  listen: (param: string) => `${BASE_INTEGRATION_URL}/listen?${param}`,
  intentGroup: (isNew: boolean) => `${BASE_INTEGRATION_URL}/sync/intent/multiple?isNew=${isNew ? 'true' : 'false'}`,
  getWorkspaceAuth: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/auth`,
  getAllServiceData: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/services/all`
}

export const apiUrls = {
  getNode: (uid: string) => `${BASE_BACKEND_URL}/node/${uid}`
}
