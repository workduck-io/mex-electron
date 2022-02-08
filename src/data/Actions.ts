import { ItemActionType, ListItemType } from '../components/spotlight/SearchResults/types'

// TODO: change shortcut keys based on user's OS
export const initActions: Array<ListItemType> = [
  // {
  //   id: '5',
  //   title: 'Shorten URL',
  //   description: 'Share this URL as an alias',
  //   type: ItemActionType.render,
  //   extras: {
  //     componentName: 'AliasWrapper'
  //   },
  //   icon: ''
  // },
  {
    id: '1',
    type: ItemActionType.search,
    title: 'Search Twitter',
    description: 'Search on Twitter',
    extras: {
      base_url: 'https://twitter.com/search?q='
    },
    icon: 'logos:twitter'
  },
  {
    id: '2',
    type: ItemActionType.open,
    title: 'Open Gmail',
    description: 'Open your default Gmail Account',
    extras: {
      base_url: 'https://gmail.com'
    },
    icon: 'logos:google-gmail'
  },
  {
    id: '7',
    title: 'New Google Doc',
    description: 'Create new empty Google Doc with default Google Account',
    type: ItemActionType.open,
    icon: 'logos:google-drive',
    extras: {
      base_url: 'https://docs.new'
    }
  },
  {
    id: '8',
    title: 'New Google Sheet',
    description: 'Create new empty Google Sheet with default Google Account',
    type: ItemActionType.open,
    icon: 'logos:google-drive',
    extras: {
      base_url: 'https://sheets.new'
    }
  },
  {
    id: '9',
    title: 'New Google Slides',
    description: 'Create new empty Google Slides with default Google Account',
    type: ItemActionType.open,
    icon: 'logos:google-drive',
    extras: {
      base_url: 'https://slides.new'
    }
  },
  {
    id: '10',
    title: 'New GitHub Gist',
    description: 'Create new GitHub Gist',
    type: ItemActionType.open,
    icon: 'logos:github-icon',
    extras: {
      base_url: 'https://gist.new'
    }
  },
  {
    id: '11',
    title: 'New GitHub Repo',
    description: 'Create new GitHub Repository',
    type: ItemActionType.open,
    icon: 'logos:github-icon',
    extras: {
      base_url: 'https://repo.new'
    }
  },
  {
    id: '12',
    title: 'New Figma File',
    description: 'Create new empty Figma File',
    type: ItemActionType.open,
    icon: 'logos:figma',
    extras: {
      base_url: 'https://figma.new'
    }
  },
  {
    id: '13',
    title: 'Search Gmail',
    description: 'Search within your default Gmail Account',
    type: ItemActionType.search,
    icon: 'logos:google-drive',
    extras: {
      base_url: 'https://mail.google.com/mail/#search/'
    }
  },
  {
    id: '14',
    title: 'Search Wikipedia',
    description: 'Search on Wikipedia',
    type: ItemActionType.search,
    icon: 'logos:xwiki',
    extras: {
      base_url: 'http://en.wikipedia.org/?search='
    }
  },
  {
    id: '15',
    title: 'Search YouTube',
    description: 'Search on YouTube',
    type: ItemActionType.search,
    icon: 'logos:youtube-icon',
    extras: {
      base_url:
        'http://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search=Search&search_query='
    }
  },
  {
    id: '16',
    title: 'Search Google Drive',
    description: 'Search Google Drive on default Google Account',
    type: ItemActionType.search,
    icon: 'logos:google-drive',
    extras: {
      base_url: 'https://drive.google.com/drive/search?q='
    }
  },
  {
    id: '17',
    title: 'Search GitHub',
    description: 'Search on GitHub',
    type: ItemActionType.search,
    icon: 'logos:github-icon',
    extras: {
      base_url: 'https://github.com/search?ref=opensearch&q='
    }
  },
  {
    id: '4',
    title: 'About Us',
    description: 'Get to know more about Workduck.io',
    type: ItemActionType.open,
    icon: 'workduck.svg',
    extras: {
      base_url: 'https://workduck.io'
    }
  }
]

export const defaultActions: ListItemType[] = initActions

export const searchBrowserAction = (query: string) => {
  return {
    id: '0',
    title: 'Search in Browser Search Bar',
    description: "Perform a search in your browser's URL Bar!",
    type: ItemActionType.browser_search,
    icon: 'search.svg',
    extras: {
      query
    }
  }
}