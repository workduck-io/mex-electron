// export const BASE_URL = 'https://api.workduck.io/integration'
export const BASE_URL = 'https://1873-106-200-232-245.ngrok.io/local'
//
export const apiURLs = {
  createTemplate: `${BASE_URL}/sync/template`,
  getIntentValues: `${BASE_URL}/intents/value`,
  listen: (param: string) => `${BASE_URL}/listen?${param}`,
  intentGroup: (isNew: boolean) => `${BASE_URL}/sync/intent/multiple?isNew=${isNew ? 'true' : 'false'}`,
  getWorkspaceAuth: (workspaceId: string) => `${BASE_URL}/workspace/${workspaceId}/auth`,
  getAllServiceData: (workspaceId: string) => `${BASE_URL}/workspace/${workspaceId}/services/all`
}
