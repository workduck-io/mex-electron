import { ACTION_ENV } from '@apis/routes'

import { ActionHelperClient } from '@workduck-io/action-request-helper'
import { type KYClient as KYInstance, KYClient } from '@workduck-io/dwindle'

import { BookmarkAPI } from './Bookmarks'
import { CommentAPI } from './Comment'
import { LinkAPI } from './Links'
import { LochAPI } from './Loch'
import { NamespaceAPI } from './NameSpace'
import { NodeAPI } from './Node'
import { ReactionAPI } from './Reaction'
import { ReminderAPI } from './Reminders'
import { ShareAPI } from './Share'
import { SnippetAPI } from './Snippet'
import { UserAPI } from './User'
import { ViewAPI } from './View'

let instance: APIClass
class APIClass {
  private client: KYClient
  public node: NodeAPI
  public share: ShareAPI
  public snippet: SnippetAPI
  public bookmark: BookmarkAPI
  public reaction: ReactionAPI
  public comment: CommentAPI
  public namespace: NamespaceAPI
  public view: ViewAPI
  public loch: LochAPI
  public link: LinkAPI
  public reminder: ReminderAPI
  public user: UserAPI
  public action: ActionHelperClient

  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!')
    }

    instance = this
  }
  init(client?: KYInstance) {
    this.client = new KYClient(undefined, client)
    this.node = new NodeAPI(this.client)
    this.share = new ShareAPI(this.client)
    this.snippet = new SnippetAPI(this.client)
    this.bookmark = new BookmarkAPI(this.client)
    this.reaction = new ReactionAPI(this.client)
    this.comment = new CommentAPI(this.client)
    this.namespace = new NamespaceAPI(this.client)
    this.loch = new LochAPI(this.client)
    this.view = new ViewAPI(this.client)
    this.link = new LinkAPI(this.client)
    this.reminder = new ReminderAPI(this.client)
    this.user = new UserAPI(this.client)
    this.action = new ActionHelperClient(this.client, undefined, ACTION_ENV)
  }
  setWorkspaceHeader(workspaceId: string) {
    this.client.setWorkspaceHeader(workspaceId)
  }
  getClient() {
    return this.client
  }
}

export const API = new APIClass()
