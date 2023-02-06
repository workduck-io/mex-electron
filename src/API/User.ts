import { apiURLs } from '@apis/routes'
import { KYClient } from '@workduck-io/dwindle'

export class UserAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }
  async getCurrent(config?) {
    return await this.client.get(apiURLs.user.getUserRecords, config)
  }

  async getByMail(mail: string, config?) {
    return await this.client.get(apiURLs.user.getFromEmail(mail), config)
  }

  async getByID(id: string, config?) {
    return await this.client.get(apiURLs.user.getFromUserId(id), config)
  }
  async updateInfo(data, config?) {
    return await this.client.put(apiURLs.user.updateInfo, data, config)
  }

  async updatePreference(userPreferences, options?) {
    return await this.client.put(apiURLs.user.updatePreference, { preference: userPreferences }, options)
  }

  async registerStatus(cacheConfig?, options?) {
    return await this.client.get(apiURLs.user.registerStatus, cacheConfig, options)
  }
}