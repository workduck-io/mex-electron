
import { apiURLs } from '@apis/routes'
import { KYClient } from '@workduck-io/dwindle'

export class ReminderAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async get(id: string, config?) {
    return await this.client.get(apiURLs.reminders.reminderByID(id), config)
  }

  async save(data, config?) {
    return await this.client.post(apiURLs.reminders.saveReminder, data, config)
  }

  async getAllOfWorkspace(config?) {
    return this.client.get(apiURLs.reminders.remindersOfWorkspace, config)
  }

  async getAllOfNode(nodeId: string, config?) {
    return this.client.get(apiURLs.reminders.remindersOfNode(nodeId), config)
  }

  async delete(id: string, config?) {
    return await this.client.delete(apiURLs.reminders.reminderByID(id), config)
  }

  async deleteAllOfNode(nodeId: string, config?) {
    return await this.client.delete(apiURLs.reminders.remindersOfNode(nodeId), config)
  }
}