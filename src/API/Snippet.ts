import { apiURLs } from '@apis/routes'
import { KYClient } from '@workduck-io/dwindle'

export class SnippetAPI {
  private client: KYClient

  constructor(client: KYClient) {
    this.client = client
  }

  async getById(id: string, config?) {
    return await this.client.get(apiURLs.snippet.getById(id), config)
  }

  async create(data, config?) {
    return await this.client.post(apiURLs.snippet.create, data, config)
  }

  async deleteAllVersions(id: string, config?) {
    return await this.client.delete(apiURLs.snippet.deleteAllVersionsOfSnippet(id), config)
  }

  async allOfWorkspace(config?) {
    return await this.client.get(apiURLs.snippet.getAllSnippetsByWorkspace, config)
  }

  async bulkGet(data, config?){
    return await this.client.post(apiURLs.snippet.bulkGet, data, config)
  }
}