import { apiURLs } from '@apis/routes'
import { KYClient } from '@workduck-io/dwindle'

export class ReactionAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async react(data, config?) {
    return await this.client.post(apiURLs.reactions.react, data, config)
  }

  async getAllOfNode(nodeId: string, config?) {
    return await this.client.get(apiURLs.reactions.allNote(nodeId), config)
  }

  async getAllOfBlock(nodeId: string, blockId: string, config?) {
    return await this.client.get(apiURLs.reactions.allBlock(nodeId, blockId), config)
  }

  async getDetailedOfBlock(nodeId: string, blockId: string, config?) {
    return await this.client.get(apiURLs.reactions.blockReactionDetails(nodeId, blockId), config)
  }
}