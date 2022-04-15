import {
  ActionHelperConfig,
  FormDataType,
  ReturnType,
  ActionGroup,
  ClickPostActionType,
  AuthTypeId
} from '@workduck-io/action-request-helper'

export const getAsanaWorkspace: ActionHelperConfig = {
  actionId: 'GET_ASANA_WORKSPACE',
  actionGroupId: 'ASANA',
  name: 'Get Workspace',
  returnType: ReturnType.OBJECT,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/workspaces'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: false,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          workspace_name: 'name',
          workspace_id: 'gid'
        }
      },
      select: {
        paths: {
          key: 'gid',
          value: 'name'
        }
      },
      url: {
        paths: {
          workspace_id: 'gid'
        }
      }
    }
  },
  template: [
    {
      key: 'Workspace Name',
      value: 'workspace_name',
      type: 'title'
    },
    {
      key: 'Workspcae Id',
      value: 'workspace_id',
      type: 'desc'
    }
  ]
}

export const getAsanaPortfolio: ActionHelperConfig = {
  actionId: 'GET_ASANA_PORTFOLIO',
  preActionId: 'GET_ASANA_WORKSPACE',
  actionGroupId: 'ASANA',
  name: 'Get Portfolio',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/portfolios?workspace={workspace_id}&owner=1202025042734668&opt_fields=name,color,permalink_url,owner.name,created_at,created_by.name,public'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          portfolio_name: 'name',
          portfolio_url: 'permalink_url',
          portfolio_color: 'color',
          portfolio_visibility: 'public',
          created_at: 'created_at',
          portfolio_owner: 'owner.name'
        }
      },
      select: {
        paths: {
          key: 'gid',
          value: 'name',
          icon: 'color'
        }
      },
      url: {
        paths: {
          portfolio_id: 'gid'
        }
      }
    }
  },
  template: [
    {
      key: 'Portfolio Name',
      value: 'portfolio_name',
      type: 'title',
      icon: 'portfolio_color'
    },
    {
      key: 'Portfolio Url',
      value: 'portfolio_url',
      type: 'url'
    },
    {
      key: 'Portfolio Visibility',
      value: 'portfolio_visibility',
      type: 'desc'
    },
    {
      key: 'Created At',
      value: 'created_at',
      type: 'timestamp'
    },
    {
      key: 'Portfolio Owner',
      value: 'portfolio_owner',
      type: 'desc'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    menus: [
      {
        actionId: 'GET_ASANA_PROJECTS',
        type: ClickPostActionType.RUN_ACTION,
        shortcut: 'CMD + c'
      }
    ]
  }
}

export const getAsanaProjects: ActionHelperConfig = {
  actionId: 'GET_ASANA_PROJECTS',
  actionGroupId: 'ASANA',
  name: 'Get Projects',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/projects/?opt_fields=name,notes,color,start_on,due_date,modified_at,permalink_url,public,team.name,workspace.name,current_status,completed'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          project_name: 'name',
          project_desc: 'notes',
          project_url: 'permalink_url',
          project_color: 'color',
          project_visibility: 'public',
          startedAt: 'start_on',
          updatedAt: 'modified_at',
          due_date: 'due_date',
          completed: 'completed',
          team_name: 'team.name',
          workspace_name: 'workspace.name',
          status_title: 'current_status?.title',
          status_text: 'current_status?.text',
          status_color: 'current_status?.color',
          status_updatedAt: 'current_status?.modified_at'
        }
      },
      select: {
        paths: {
          key: 'gid',
          value: 'name',
          icon: 'color'
        }
      },
      url: {
        paths: {
          project_id: 'gid'
        }
      }
    }
  },
  template: [
    {
      key: 'Project Name',
      value: 'project_name',
      type: 'title'
    },
    {
      key: 'Project Description',
      value: 'project_desc',
      type: 'desc'
    },
    {
      key: 'Project URL',
      value: 'project_url',
      type: 'url'
    },
    {
      key: 'Project Color',
      value: 'project_color',
      type: 'desc'
    },
    {
      key: 'Project Visibility',
      value: 'project_visibility',
      type: 'desc'
    },
    {
      key: 'Started At',
      value: 'startedAt',
      type: 'timestamp'
    },
    {
      key: 'Updated At',
      value: 'updatedAt',
      type: 'timestamp'
    },
    {
      key: 'Due Date',
      value: 'due_date',
      type: 'timestamp'
    },
    {
      key: 'Completed',
      value: 'completed',
      type: 'desc'
    },
    {
      key: 'Team name',
      value: 'team_name',
      type: 'desc'
    },
    {
      key: 'Workspace Name',
      value: 'workspace_name',
      type: 'desc'
    },
    {
      key: 'Status Title',
      value: 'status_title',
      type: 'title'
    },
    {
      key: 'Status Text',
      value: 'status_text',
      type: 'desc'
    },
    {
      key: 'Status Color',
      value: 'status_color',
      type: 'desc'
    },
    {
      key: 'Status UpdateAt',
      value: 'status_updatedAt',
      type: 'timestamp'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    menus: [
      {
        actionId: 'GET_ASANA_TASKS',
        type: ClickPostActionType.RUN_ACTION,
        shortcut: 'CMD + R'
      }
    ]
  }
}

export const getAsanaTasks: ActionHelperConfig = {
  actionId: 'GET_ASANA_TASKS',
  preActionId: 'GET_ASANA_PROJECTS',
  actionGroupId: 'ASANA',
  name: 'Get Tasks',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/tasks?project={project_id}&opt_fields=name,notes,permalink_url,created_at,due_at,modified_at,projects.name,workspace.name,assignee.name,assignee_status,assignee_section.name,completed,tags.name,tags.color,tags.notes'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          task_name: 'name',
          task_desc: 'notes',
          task_url: 'permalink_url',
          createdAt: 'created_at',
          due_date: 'due_at',
          updatedAt: 'modified_at',
          assignee_name: 'assignee.name',
          assignee_status: 'assignee_status',
          completed: 'completed',
          projects: {
            root: 'projects',
            paths: {
              project_name: 'name'
            }
          },
          tags: {
            root: 'tags',
            paths: {
              tag_name: 'name',
              tag_color: 'color',
              tag_desc: 'notes'
            }
          },
          workspace_name: 'workspace.name'
        }
      },
      select: {
        paths: {
          key: 'gid',
          value: 'name'
        }
      },
      url: {
        paths: {
          task_id: 'gid'
        }
      }
    }
  },
  template: [
    {
      key: 'Task Name',
      value: 'task_name',
      type: 'title'
    },
    {
      key: 'Task Description',
      value: 'task_desc',
      type: 'desc'
    },

    {
      key: 'Task URL',
      value: 'task_url',
      type: 'url'
    },
    {
      key: 'Created At',
      value: 'createdAt',
      type: 'timestamp'
    },
    {
      key: 'Due Date',
      value: 'due_date',
      type: 'timestamp'
    },
    {
      key: 'Updated At',
      value: 'updatedAt',
      type: 'timestamp'
    },
    {
      key: 'Assignee Name',
      value: 'assignee_name',
      type: 'desc'
    },
    {
      key: 'Assignee Status',
      value: 'assignee_status',
      type: 'desc'
    },
    {
      key: 'Completed Status',
      value: 'completed',
      type: 'desc'
    },
    {
      key: 'Workspace Name',
      value: 'workspace_name',
      type: 'desc'
    },
    {
      key: 'Projects',
      value: 'projects',
      type: 'desc'
    },
    {
      key: 'Tags',
      value: 'tags',
      type: 'labels'
    }
  ]
}

export const getAsanaSubTasks: ActionHelperConfig = {
  actionId: 'GET_ASANA_SUB_TASKS',
  preActionId: 'GET_ASANA_TASKS',
  actionGroupId: 'ASANA',
  name: 'Get Sub Tasks',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/tasks/{task_id}/subtasks?opt_fields=name,notes,permalink_url,created_at,due_at,modified_at,projects.name,workspace.name,assignee.name,assignee_status,assignee_section.name,completed,tags.name,tags.color,tags.notes'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          task_name: 'name',
          task_desc: 'notes',
          task_url: 'permalink_url',
          createdAt: 'created_at',
          due_date: 'due_at',
          updatedAt: 'modified_at',
          assignee_name: 'assignee.name',
          assignee_status: 'assignee_status',
          completed: 'completed',
          projects: {
            root: 'projects',
            paths: {
              project_name: 'name'
            }
          },
          tags: {
            root: 'tags',
            paths: {
              tag_name: 'name',
              tag_color: 'color',
              tag_desc: 'notes'
            }
          },
          workspace_name: 'workspace.name'
        }
      },
      select: {
        paths: {
          key: 'gid',
          value: 'name'
        }
      }
    }
  },
  template: [
    {
      key: 'Task Name',
      value: 'task_name',
      type: 'title'
    },
    {
      key: 'Task Description',
      value: 'task_desc',
      type: 'desc'
    },

    {
      key: 'Task URL',
      value: 'task_url',
      type: 'url'
    },
    {
      key: 'Created At',
      value: 'createdAt',
      type: 'timestamp'
    },
    {
      key: 'Due Date',
      value: 'due_date',
      type: 'timestamp'
    },
    {
      key: 'Updated At',
      value: 'updatedAt',
      type: 'timestamp'
    },
    {
      key: 'Assignee Name',
      value: 'assignee_name',
      type: 'desc'
    },
    {
      key: 'Assignee Status',
      value: 'assignee_status',
      type: 'desc'
    },
    {
      key: 'Completed Status',
      value: 'completed',
      type: 'desc'
    },
    {
      key: 'Workspace Name',
      value: 'workspace_name',
      type: 'desc'
    },
    {
      key: 'Projects',
      value: 'projects',
      type: 'desc'
    },
    {
      key: 'Tags',
      value: 'tags',
      type: 'labels'
    }
  ]
}

export const getAsanaUsers: ActionHelperConfig = {
  actionId: 'GET_ASANA_USERS',
  actionGroupId: 'ASANA',
  name: 'Get Users',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/users/?opt_fields=name,email,photo,workspaces'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          user_name: 'name',
          user_email: 'email',
          user_photo: 'photo?.image_60x60',
          user_workspace: 'workspaces[0].gid',
          user_workspaces: {
            root: 'workspaces',
            paths: {
              workspace_name: 'name',
              workspace_id: 'gid'
            }
          }
        }
      },
      select: {
        paths: {
          key: 'gid',
          value: 'name',
          icon: 'photo?.image_60x60'
        }
      },
      url: {
        paths: {
          user_id: 'gid',
          workspace_id: 'workspaces[0].gid'
        }
      }
    }
  },
  template: [
    {
      key: 'User Name',
      value: 'user_name',
      type: 'title'
    },
    {
      key: 'User Email',
      value: 'user_email',
      type: 'desc'
    },
    {
      key: 'User Photo',
      value: 'user_photo',
      type: 'icon',
      icon: 'user_photo'
    },
    {
      key: 'Workspaces',
      value: 'user_workspaces',
      type: 'desc'
    }
  ]
}

export const getUserAssignedTasks: ActionHelperConfig = {
  actionId: 'GET_USER_ASSIGNED_TASKS',
  preActionId: 'GET_ASANA_USERS',
  actionGroupId: 'ASANA',
  name: 'Get User Assigned Tasks',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/tasks?opt_fields=name,notes,permalink_url,created_at,due_at,modified_at,projects.name,workspace.name,assignee.name,assignee_status,assignee_section.name,completed,tags.name,tags.color,tags.notes&assignee={user_id}&limit=30&workspace={workspace_id}'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          task_name: 'name',
          task_desc: 'notes',
          task_url: 'permalink_url',
          createdAt: 'created_at',
          due_date: 'due_at',
          updatedAt: 'modified_at',
          assignee_name: 'assignee.name',
          assignee_status: 'assignee_status',
          completed: 'completed',
          projects: {
            root: 'projects',
            paths: {
              project_name: 'name'
            }
          },
          tags: {
            root: 'tags',
            paths: {
              tag_name: 'name',
              tag_color: 'color',
              tag_desc: 'notes'
            }
          },
          workspace_name: 'workspace.name'
        }
      },
      select: {
        paths: {
          key: 'gid',
          value: 'name'
        }
      }
    }
  },
  template: [
    {
      key: 'Task Name',
      value: 'task_name',
      type: 'title'
    },
    {
      key: 'Task Description',
      value: 'task_desc',
      type: 'desc'
    },

    {
      key: 'Task URL',
      value: 'task_url',
      type: 'url'
    },
    {
      key: 'Created At',
      value: 'createdAt',
      type: 'timestamp'
    },
    {
      key: 'Due Date',
      value: 'due_date',
      type: 'timestamp'
    },
    {
      key: 'Updated At',
      value: 'updatedAt',
      type: 'timestamp'
    },
    {
      key: 'Assignee Name',
      value: 'assignee_name',
      type: 'desc'
    },
    {
      key: 'Assignee Status',
      value: 'assignee_status',
      type: 'desc'
    },
    {
      key: 'Completed Status',
      value: 'completed',
      type: 'desc'
    },
    {
      key: 'Workspace Name',
      value: 'workspace_name',
      type: 'desc'
    },
    {
      key: 'Projects',
      value: 'projects',
      type: 'desc'
    },
    {
      key: 'Tags',
      value: 'tags',
      type: 'labels'
    }
  ]
}

export const getTasksComments: ActionHelperConfig = {
  actionId: 'GET_TASKS_COMMENTS',
  preActionId: 'GET_USER_ASSIGNED_TASKS',
  actionGroupId: 'ASANA',
  name: 'Get Tasks Comments',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/tasks/{task_id}/stories?opt_fields=created_by.name,created_by.photo,text,modified_at,created_at,resource_subtype,type'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          comment_text: 'text',
          comment_createdAt: 'created_at',
          created_by_name: 'created_by?.name',
          created_by_photo: 'created_by.photo?.image_60x60'
        }
      }
    },
    filter: {
      root: 'data',
      key: 'type',
      value: 'comment'
    }
  },
  template: [
    {
      key: 'Comment Text',
      value: 'comment_text',
      type: 'title'
    },
    {
      key: 'Comment Created At',
      value: 'comment_createdAt',
      type: 'timestamp'
    },
    {
      key: 'Created By Name',
      value: 'created_by_name',
      type: 'icon',
      icon: 'created_by_photo'
    }
  ]
}

export const postAsanaTask: ActionHelperConfig = {
  actionId: 'POST_ASANA_TASK',
  actionGroupId: 'ASANA',
  name: 'Post Asana Task',
  returnType: ReturnType.OBJECT,
  request: {
    type: 'POST',
    URL: 'https://app.asana.com/api/1.0/tasks'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  transform: {
    root: 'data',
    fields: {
      url: {
        paths: {
          task_id: 'gid'
        }
      }
    }
  },
  modifers: {
    body: {
      data: {
        workspace: '1200196388118872',
        projects: ['1202028827145405'],
        name: 'New task from config val',
        notes: 'this is the new task related to asana integration',
        assignee: '1202025042734668',
        due_on: '2022-04-25'
      }
    }
  },
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    result: {
      actionId: 'GET_ASANA_TASK',
      type: ClickPostActionType.RUN_ACTION
    }
  },
  form: [
    {
      key: 'Workspace',
      label: 'Select Workspace',
      type: FormDataType.SELECT,
      actionId: 'GET_ASANA_WORKSPACE',
      options: {
        placeholder: 'Select Workspace',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'Projects',
      label: 'Select Projects',
      type: FormDataType.MULTI_SELECT,
      actionId: 'GET_ASANA_PROJECTS',
      options: {
        placeholder: 'Select Projects',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'Name',
      label: 'Task Name',
      type: FormDataType.TEXT,
      options: {
        placeholder: 'Task Title',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'Description',
      label: 'Task Description',
      type: FormDataType.TEXT,
      options: {
        placeholder: 'Task Description',
        required: false,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'assignees',
      label: 'Task Assignees',
      type: FormDataType.MULTI_SELECT,
      actionId: 'GET_ASANA_USERS',
      options: {
        placeholder: 'Select Assignees',
        required: false,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'due date',
      label: 'Task Due Date',
      type: FormDataType.DATE,
      options: {
        placeholder: 'Select Due Date',
        required: false,
        flex: 1,
        row: 0
      }
    }
  ]
}

export const getAsanaTask: ActionHelperConfig = {
  actionId: 'GET_ASANA_TASK',
  preActionId: 'POST_ASANA_TASK',
  actionGroupId: 'ASANA',
  name: 'Get Asana Task',
  returnType: ReturnType.OBJECT,
  request: {
    type: 'GET',
    URL: 'https://app.asana.com/api/1.0/tasks/{task_id}'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: false,
  transform: {
    root: 'data',
    fields: {
      data: {
        paths: {
          task_name: 'name',
          task_desc: 'notes',
          task_url: 'permalink_url',
          createdAt: 'created_at',
          due_date: 'due_at',
          updatedAt: 'modified_at',
          assignee_name: 'assignee.name',
          assignee_status: 'assignee_status',
          completed: 'completed',
          projects: {
            root: 'projects',
            paths: {
              project_name: 'name'
            }
          },
          tags: {
            root: 'tags',
            paths: {
              tag_name: 'name',
              tag_color: 'color',
              tag_desc: 'notes'
            }
          },
          workspace_name: 'workspace.name'
        }
      }
    }
  },
  template: [
    {
      key: 'Task Name',
      value: 'task_name',
      type: 'title'
    },
    {
      key: 'Task Description',
      value: 'task_desc',
      type: 'desc'
    },

    {
      key: 'Task URL',
      value: 'task_url',
      type: 'url'
    },
    {
      key: 'Created At',
      value: 'createdAt',
      type: 'timestamp'
    },
    {
      key: 'Due Date',
      value: 'due_date',
      type: 'timestamp'
    },
    {
      key: 'Updated At',
      value: 'updatedAt',
      type: 'timestamp'
    },
    {
      key: 'Assignee Name',
      value: 'assignee_name',
      type: 'desc'
    },
    {
      key: 'Assignee Status',
      value: 'assignee_status',
      type: 'desc'
    },
    {
      key: 'Completed Status',
      value: 'completed',
      type: 'desc'
    },
    {
      key: 'Workspace Name',
      value: 'workspace_name',
      type: 'desc'
    },
    {
      key: 'Projects',
      value: 'projects',
      type: 'desc'
    },
    {
      key: 'Tags',
      value: 'tags',
      type: 'labels'
    }
  ]
}

export const postAsanaComment: ActionHelperConfig = {
  actionId: 'POST_ASANA_COMMENT',
  preActionId: 'GET_ASANA_TASK',
  actionGroupId: 'ASANA',
  name: 'Post Asana Comment',
  returnType: ReturnType.OBJECT,
  request: {
    type: 'POST',
    URL: 'https://app.asana.com/api/1.0/tasks/{task_id}/stories'
  },
  authTypeId: AuthTypeId.ASANA_AUTH,
  visibility: true,
  modifers: {
    body: {
      data: {
        text: 'Comment from vivek'
      }
    }
  },
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    result: {
      actionId: 'GET_TASKS_COMMENTS',
      type: ClickPostActionType.RUN_ACTION
    }
  },
  form: [
    {
      key: 'Project',
      label: 'Select Project',
      type: FormDataType.SELECT,
      actionId: 'GET_ASANA_PROJECTS',
      options: {
        placeholder: 'Select Project',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'Task',
      label: 'Select Task',
      type: FormDataType.SELECT,
      actionId: 'GET_ASANA_TASKS',
      options: {
        placeholder: 'Select Task',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'body',
      label: 'Comment Text',
      type: FormDataType.TEXT,
      options: {
        placeholder: 'Comment Text',
        required: true,
        flex: 1,
        row: 0
      }
    }
  ]
}

export const getLinearIssues: ActionHelperConfig = {
  actionId: 'GET_LINEAR_ISSUES',
  actionGroupId: 'LINEAR',
  name: 'Get Linear Issues',
  returnType: ReturnType.LIST,
  request: {
    type: 'POST',
    URL: 'https://api.linear.app/graphql'
  },
  authTypeId: AuthTypeId.LINEAR_AUTH,
  visibility: true,
  transform: {
    root: 'data.issues.nodes',
    fields: {
      data: {
        paths: {
          issue_id: 'id',
          issue_title: 'title',
          issue_desc: 'description',
          issue_number: 'number',
          issue_branch: 'branchName',
          updated: 'updatedAt',
          creator: 'creator.name',
          creator_icon: 'creator.avatarUrl',
          assignee: 'assignee?.name',
          assignee_icon: 'assignee?.avatarUrl',
          status: 'state?.name',
          priority: 'priority',
          priority_label: 'priorityLabel',
          project_name: 'project?.name',
          project_icon: 'project?.icon',
          issue_url: 'url',
          labels: {
            root: 'labels.nodes',
            paths: {
              label_name: 'name',
              label_desc: 'description',
              label_color: 'color'
            }
          }
        }
      },
      select: {
        paths: {
          priority: 'priority',
          priority_label: 'priorityLabel',
          issue_title: 'title',
          issue_number: 'number',
          status: 'state?.name',
          updated: 'updatedAt',
          assignee: 'assignee?.name',
          assignee_icon: 'assignee?.avatarUrl'
        }
      }
    }
  },

  template: [
    {
      key: 'Issue_Title',
      value: 'issue_title',
      type: 'title'
    },

    {
      key: 'Updated At',
      value: 'updated',
      type: 'timestamp'
    },
    {
      key: 'Creator',
      value: 'creator',
      type: 'icon',
      icon: 'creator_icon'
    },
    {
      key: 'Assignee',
      value: 'assignee',
      type: 'icon',
      icon: 'assignee_icon'
    },
    {
      key: 'Issue Description',
      value: 'issue_desc',
      type: 'desc'
    },
    // {
    //   key: 'Issue Number',
    //   value: 'issue_number',
    //   type: 'desc'
    // },
    // {
    //   key: 'Issue Id',
    //   value: 'issue_id',
    //   type: 'desc'
    // },
    // {
    //   key: 'Issue Branch',
    //   value: 'issue_branch',
    //   type: 'desc'
    // },
    // {
    //   key: 'Status',
    //   value: 'status',
    //   type: 'desc'
    // },
    // {
    //   key: 'Priority',
    //   value: 'priority',
    //   type: 'desc'
    // },
    // {
    //   key: 'Priority Label',
    //   value: 'priority_label',
    //   type: 'desc'
    // },
    {
      key: 'Project Name',
      value: 'project_name',
      type: 'icon',
      icon: 'project_icon'
    }
    // {
    //   key: 'Issue URL',
    //   value: 'issue_url',
    //   type: 'url'
    // }
    // {
    //   key: 'Labels',
    //   value: 'labels',
    //   type: 'list'
    // }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    menus: [
      {
        actionId: 'GET_LINEAR_ISSUE_COMMENTS',
        type: ClickPostActionType.RUN_ACTION,
        shortcut: 'CMD + i'
      }
    ]
  },
  modifers: {
    body: {
      query:
        '{ issues { nodes { id title description assignee { id name url avatarUrl } createdAt updatedAt state { id name } priority priorityLabel project { name description color icon } url number creator { id name url avatarUrl } branchName cycle { id name } labels { nodes { id name description color } }  } } }'
    }
  }
}

export const getGithubRepos: ActionHelperConfig = {
  actionId: 'GET_GITHUB_REPOS',
  actionGroupId: 'GITHUB',
  name: 'Get Repos',
  visibility: true,
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://api.github.com/user/repos'
  },
  authTypeId: AuthTypeId.GITHUB_OAUTH,
  transform: {
    fields: {
      data: {
        paths: {
          repo_name: 'full_name',
          repo_desc: 'description',
          repo_url: 'html_url',
          timestamp: 'updated_at',
          user: 'owner.login',
          user_icon: 'owner.avatar_url',
          visibility: 'visibility',
          stars: 'stargazers_count',
          language: 'language'
        }
      },
      select: {
        paths: {
          key: 'id',
          value: 'full_name',
          icon: 'owner.avatar_url'
        }
      },
      url: {
        paths: {
          full_name: 'full_name'
        }
      }
    }
  },
  template: [
    {
      key: 'Repo Name',
      value: 'repo_name',
      type: 'title'
    },
    {
      key: 'Repo Description',
      value: 'repo_desc',
      type: 'desc'
    },
    {
      key: 'Repo URL',
      value: 'repo_url',
      type: 'url'
    },
    {
      key: 'Updated',
      value: 'timestamp',
      type: 'timestamp'
    },
    {
      key: 'Author',
      value: 'user',
      type: 'icon',
      icon: 'user_icon'
    },
    {
      key: 'Visibility',
      value: 'visibility',
      type: 'desc'
    },
    {
      key: 'Stars',
      value: 'stars',
      type: 'desc'
    },
    {
      key: 'Language',
      value: 'language',
      type: 'desc'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    menus: [
      {
        actionId: 'GET_GITHUB_REPO_ISSUES',
        type: ClickPostActionType.RUN_ACTION,
        shortcut: 'CMD + i'
      }
    ]
  }
}

export const getGithubRepoIssues: ActionHelperConfig = {
  actionId: 'GET_GITHUB_REPO_ISSUES',
  actionGroupId: 'GITHUB',
  name: 'Get Repo Issues',
  visibility: true,
  returnType: ReturnType.LIST,
  preActionId: 'GET_GITHUB_REPOS',
  request: {
    type: 'GET',
    URL: 'https://api.github.com/repos/{full_name}/issues'
  },
  authTypeId: AuthTypeId.GITHUB_OAUTH,
  transform: {
    fields: {
      data: {
        paths: {
          issue_title: 'title',
          issue_desc: 'body',
          user: 'user.login',
          user_icon: 'user.avatar_url',
          updated: 'updated_at',
          issue_url: 'html_url',
          issue_number: 'number',
          issue_state: 'state',
          issue_comments: 'comments',
          milestone_title: 'milestone?.title',
          milestone_desc: 'milestone?.description',
          milestone_url: 'milestone?.html_url',
          labels: {
            root: 'labels',
            paths: {
              label_name: 'name',
              label_desc: 'description',
              label_color: 'color'
            }
          },
          assignees: {
            root: 'assignees',
            paths: {
              assignee_name: 'login',
              assignee_url: 'avatar_url'
            }
          }
        }
      },
      select: {
        paths: {
          key: 'number',
          value: 'title',
          icon: 'user.avatar_url'
        }
      },
      url: {
        paths: {
          issue: 'url'
        }
      }
    }
  },
  template: [
    {
      key: 'Title',
      value: 'issue_title',
      type: 'title'
    },
    {
      key: 'Description',
      value: 'issue_desc',
      type: 'desc'
    },
    {
      key: 'Author',
      value: 'user',
      type: 'icon',
      icon: 'user_icon'
    },
    {
      key: 'Updated',
      value: 'updated',
      type: 'timestamp'
    },
    {
      key: 'Issue URL',
      value: 'issue_url',
      type: 'url'
    },
    {
      key: 'Issue Number',
      value: 'issue_number',
      type: 'desc'
    },
    {
      key: 'Status',
      value: 'issue_state',
      type: 'icon',
      icon: ''
    },
    {
      key: 'Issue Comments',
      value: 'issue_comments',
      type: 'desc'
    },
    {
      key: 'Milestone title',
      value: 'milestone_title',
      type: 'desc'
    },
    {
      key: 'Milestone Description',
      value: 'milestone_desc',
      type: 'desc'
    },
    {
      key: 'Milestone URL',
      value: 'milestone_url',
      type: 'url'
    },
    {
      key: 'Labels',
      value: 'labels',
      type: 'desc'
    },
    {
      key: 'Assignees',
      value: 'assignees',
      type: 'desc'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    menus: [
      {
        actionId: 'GET_GITHUB_ISSUES_COMMENTS',
        type: ClickPostActionType.RUN_ACTION,
        shortcut: 'CMD + c'
      }
    ]
  }
}
export const postIssue: ActionHelperConfig = {
  actionId: 'POST_ISSUE',
  actionGroupId: 'GITHUB',
  visibility: true,
  name: 'Post Issue',
  returnType: ReturnType.OBJECT,
  preActionId: 'GET_GITHUB_REPOS',
  request: {
    type: 'POST',
    URL: 'https://api.github.com/repos/{full_name}/issues'
  },
  authTypeId: AuthTypeId.GITHUB_OAUTH,
  transform: {
    fields: {
      select: {
        paths: {
          issue_title: 'title',
          issue_desc: 'body',
          user: 'user.login',
          user_icon: 'user.avatar_url',
          updated: 'updated_at',
          issue_url: 'html_url',
          issue_number: 'number',
          issue_state: 'state',
          issue_comments: 'comments',
          milestone_title: 'milestone?.title',
          milestone_desc: 'milestone?.description',
          milestone_url: 'milestone?.html_url',
          labels: {
            root: 'labels',
            paths: {
              label_name: 'name',
              label_desc: 'description',
              label_color: 'color'
            }
          },
          assignees: {
            root: 'assignees',
            paths: {
              assignee_name: 'login',
              assignee_url: 'avatar_url'
            }
          }
        }
      }
    }
  },
  template: [
    {
      key: 'Title',
      value: 'issue_title',
      type: 'title'
    },
    {
      key: 'Description',
      value: 'issue_desc',
      type: 'desc'
    },
    {
      key: 'Author',
      value: 'user',
      type: 'icon',
      icon: 'user_icon'
    },
    {
      key: 'Updated',
      value: 'updated',
      type: 'timestamp'
    },
    {
      key: 'Issue URL',
      value: 'issue_url',
      type: 'url'
    },
    {
      key: 'Issue Number',
      value: 'issue_number',
      type: 'desc'
    },
    {
      key: 'Status',
      value: 'issue_state',
      type: 'icon',
      icon: ''
    },
    {
      key: 'Issue Comments',
      value: 'issue_comments',
      type: 'desc'
    },
    {
      key: 'Milestone title',
      value: 'milestone_title',
      type: 'desc'
    },
    {
      key: 'Milestone Description',
      value: 'milestone_desc',
      type: 'desc'
    },
    {
      key: 'Milestone URL',
      value: 'milestone_url',
      type: 'url'
    },
    {
      key: 'Labels',
      value: 'labels',
      type: 'desc'
    },
    {
      key: 'Assignees',
      value: 'assignees',
      type: 'desc'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    }
  },
  form: [
    {
      key: 'Repository',
      label: 'Select Repository',
      type: FormDataType.SELECT,
      actionId: 'GET_GITHUB_REPOS',
      options: {
        placeholder: 'Select Repository',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'title',
      label: 'Title',
      type: FormDataType.TEXT,
      options: {
        placeholder: 'Issue Title',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'body',
      label: 'Description',
      type: FormDataType.TEXT,
      options: {
        placeholder: 'Issue Description',
        required: false,
        flex: 1,
        row: 0
      }
    }
  ]
}
export const getGithubIssuesComments: ActionHelperConfig = {
  actionId: 'GET_GITHUB_ISSUES_COMMENTS',
  actionGroupId: 'GITHUB',
  name: 'Get Issues Comments',
  returnType: ReturnType.LIST,
  visibility: true,
  preActionId: 'GET_GITHUB_REPO_ISSUES',
  request: {
    type: 'GET',
    URL: '{issue}/comments'
  },
  authTypeId: AuthTypeId.GITHUB_OAUTH,
  transform: {
    fields: {
      data: {
        paths: {
          comment_message: 'body',
          user: 'user.login',
          user_icon: 'user.avatar_url',
          updated: 'updated_at',
          comment_url: 'html_url'
        }
      },
      select: {
        paths: {
          key: 'id',
          value: 'body',
          icon: 'user.avatar_url'
        }
      }
    }
  },
  template: [
    {
      key: 'icon',
      value: 'user',
      type: 'icon',
      icon: 'user_icon'
    },
    {
      key: 'Comment Body',
      value: 'comment_message',
      type: 'title'
    },
    {
      key: 'updated',
      value: 'updated',
      type: 'timestamp'
    },
    {
      key: 'Comment URL',
      value: 'comment_url',
      type: 'url'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    menus: [
      {
        actionId: 'POST_ISSUE_COMMENT',
        type: ClickPostActionType.RUN_ACTION,
        shortcut: 'CMD + c'
      }
    ]
  }
}

export const postIssueComment: ActionHelperConfig = {
  actionId: 'POST_ISSUE_COMMENT',
  actionGroupId: 'GITHUB',
  name: 'Post Comment',
  returnType: ReturnType.OBJECT,
  preActionId: 'GET_GITHUB_REPO_ISSUES',
  request: {
    type: 'POST',
    URL: '{issue}/comments'
  },
  visibility: true,
  authTypeId: AuthTypeId.GITHUB_OAUTH,
  transform: {
    fields: {
      data: {
        paths: {
          comment_message: 'body',
          user: 'user.login',
          user_icon: 'user.avatar_url',
          updated: 'updated_at',
          comment_url: 'html_url'
        }
      },
      select: {
        paths: {
          comment_message: 'body',
          user: 'user.login',
          user_icon: 'user.avatar_url',
          updated: 'updated_at',
          comment_url: 'html_url'
        }
      }
    }
  },
  template: [
    {
      key: 'Comment Body',
      value: 'comment_message',
      type: 'title'
    },
    {
      key: 'icon',
      value: 'user',
      type: 'icon',
      icon: 'user_icon'
    },
    {
      key: 'updated',
      value: 'updated',
      type: 'timestamp'
    },
    {
      key: 'Comment URL',
      value: 'comment_url',
      type: 'url'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    }
  },
  form: [
    {
      key: 'Repository',
      label: 'Select Repository',
      type: FormDataType.SELECT,
      actionId: 'GET_GIHTUB_REPOS',
      options: {
        placeholder: 'Select Repository',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'Issues',
      label: 'Select Issues',
      type: FormDataType.SELECT,
      actionId: 'GET_GITHUB_REPO_ISSUES',
      options: {
        placeholder: 'Select Issue',
        required: true,
        flex: 1,
        row: 0
      }
    },
    {
      key: 'body',
      label: 'Comment Body',
      type: FormDataType.TEXT,
      options: {
        placeholder: 'Comment Body',
        required: true,
        flex: 1,
        row: 0
      }
    }
  ]
}
export const getGithubIssues: ActionHelperConfig = {
  actionId: 'GET_GITHUB_ISSUES',
  actionGroupId: 'GITHUB',
  name: 'Get Issues',
  returnType: ReturnType.LIST,
  request: {
    type: 'GET',
    URL: 'https://api.github.com/user/issues?state=all&filter=created'
  },
  visibility: true,
  authTypeId: AuthTypeId.GITHUB_OAUTH,
  transform: {
    fields: {
      data: {
        paths: {
          issue_title: 'title',
          issue_desc: 'title',
          user: 'user.login',
          user_icon: 'user.avatar_url',
          updated: 'updated_at',
          issue_url: 'html_url',
          issue_number: 'number',
          issue_state: 'state',
          issue_comments: 'comments',
          milestone_title: 'milestone?.title',
          milestone_desc: 'milestone?.description',
          milestone_url: 'milestone?.html_url',
          labels: {
            root: 'labels',
            paths: {
              label_name: 'name',
              label_desc: 'description',
              label_color: 'color'
            }
          },
          assignees: {
            root: 'assignees',
            paths: {
              assignee_name: 'login',
              assignee_url: 'avatar_url'
            }
          }
        }
      },
      select: {
        paths: {
          key: 'number',
          value: 'title',
          icon: 'user.avatar_url'
        }
      },
      url: {
        paths: {
          issue: 'url'
        }
      }
    }
  },
  template: [
    {
      key: 'Title',
      value: 'issue_title',
      type: 'title'
    },
    {
      key: 'Description',
      value: 'issue_desc',
      type: 'desc'
    },
    {
      key: 'Author',
      value: 'user',
      type: 'icon',
      icon: 'user_icon'
    },
    {
      key: 'Updated',
      value: 'updated',
      type: 'timestamp'
    },
    {
      key: 'Issue URL',
      value: 'issue_url',
      type: 'url'
    },
    {
      key: 'Issue Number',
      value: 'issue_number',
      type: 'desc'
    },
    {
      key: 'Status',
      value: 'issue_state',
      type: 'icon',
      icon: ''
    },
    {
      key: 'Issue Comments',
      value: 'issue_comments',
      type: 'desc'
    },
    {
      key: 'Milestone title',
      value: 'milestone_title',
      type: 'desc'
    },
    {
      key: 'Milestone Description',
      value: 'milestone_desc',
      type: 'desc'
    },
    {
      key: 'Milestone URL',
      value: 'milestone_url',
      type: 'url'
    },
    {
      key: 'Labels',
      value: 'labels',
      type: 'desc'
    },
    {
      key: 'Assignees',
      value: 'assignees',
      type: 'desc'
    }
  ],
  postAction: {
    onClick: {
      type: ClickPostActionType.VIEW_DATA
    },
    onDoubleClick: {
      type: ClickPostActionType.OPEN_URL
    },
    menus: [
      {
        actionId: 'GET_GITHUB_COMMENTS',
        type: ClickPostActionType.RUN_ACTION,
        shortcut: 'CMD + c'
      }
    ]
  }
}
