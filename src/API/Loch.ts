import { apiURLs, GOOGLE_OAUTH2_REFRESH_URL } from '@apis/routes'
import { KYClient } from '@workduck-io/dwindle'

export class LochAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }
  async get(nodeId: string, config?) {
    return await this.client.post(apiURLs.bookmarks.create(nodeId), undefined, config)
  }

  async connect(data, config?) {
    return await this.client.post(apiURLs.loch.connectToService, data, config)
  }

  async updateParent(data, config?) {
    return await this.client.put(apiURLs.loch.updateParentNoteOfService, data, config)
  }

  async getAllServices(config?) {
    return await this.client.get(apiURLs.loch.getAllServices, config)
  }

  async getAllConnected(config?) {
    return await this.client.get(apiURLs.loch.getConnectedServices, config)
  }

  async getGoogleAuthUrl(config?){
    return await this.client.get<any>(apiURLs.getGoogleAuthUrl(),config)
  }
  
  async fetchRefereshToken(data){
    return await this.client.post(GOOGLE_OAUTH2_REFRESH_URL,data);
  }
}