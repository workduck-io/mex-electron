import { apiURLs } from '@apis/routes'
import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

export class BookmarkAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async create(nodeId: string, config?) {
    return await this.client.post(apiURLs.bookmarks.create(nodeId), undefined, config)
  }

  async remove(nodeId: string, config?) {
    return await this.client.patch(apiURLs.bookmarks.create(nodeId), undefined, config)
  }

  async getAll(config?) {
    return await this.client.get(apiURLs.bookmarks.getAll, config)
  }
}