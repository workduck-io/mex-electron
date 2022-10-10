import { mog } from '@utils/lib/mog'

import { client } from '@workduck-io/dwindle'

import { useApiStore } from '../../store/useApiStore'

export const clientInterceptor = client.interceptors.response.use(
  async (response) => {
    const setRequest = useApiStore.getState().setRequest
    mog(`setRequest { ${response.config.url ?? 'Unspecified URL'} }`)
    setRequest(response.config.url, {
      url: response.config.url,
      time: Date.now(),
      method: response.config.method
    })
    return response
  },
  (error) => {
    throw error
  }
)
