export const BASE_URL = 'https://api.workduck.io/integration'
export const apiURLs = {
  createTemplate: `${BASE_URL}/sync/template`,
  getIntentValues: `${BASE_URL}/intents/value`,
  listen: (param: string) => `${BASE_URL}/listen?${param}`,
  intentGroup: (isNew: boolean) => `${BASE_URL}/sync/intent/multiple?isNew=${isNew ? 'true' : 'false'}`,
  getWorkspaceAuth: (workspaceId: string) => `${BASE_URL}/workspace/${workspaceId}/auth`
}
