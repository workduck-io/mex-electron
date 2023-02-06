
import { apiURLs } from '@apis/routes'
import { KYClient } from '@workduck-io/dwindle'

export class LinkAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async save(data, config?) {
    return await this.client.post(apiURLs.links.saveLink, data, config)
  }

  async getAll(config?) {
    return this.client.get(apiURLs.links.getLinks, config)
  }

  async delete(hashURL: string, config?) {
    return await this.client.delete(apiURLs.links.deleteLink(hashURL), config)
  }
}