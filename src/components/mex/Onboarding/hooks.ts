// import { useSyncStore } from '../../Editor/Store/useSyncStore'

import { useEditorStore } from '../../../store/useEditorStore'
import useDataStore from '../../../store/useDataStore'
import { useSyncStore } from '../../../store/useSyncStore'
import { snippetTourContent, tourNodeContent } from './tourNode'
import useLoad from '../../../hooks/useLoad'
import { ID_SEPARATOR, SNIPPET_PREFIX } from '../../../data/Defaults/idPrefixes'
import { useSnippetStore } from '../../../store/useSnippetStore'
import { useUpdater } from '../../../hooks/useUpdater'
import useOnboard from '../../../store/useOnboarding'

import { GettingStartedListProps } from './sections/GettingStarted'
import { useDelete } from '../../../hooks/useDelete'

export const useOnboardingData = () => {
  const templates = useSyncStore((store) => store.templates)
  const services = useSyncStore((store) => store.services)
  const ilinks = useDataStore((store) => store.ilinks)
  const snippets = useSnippetStore((store) => store.snippets)

  const setStep = useOnboard((store) => store.setStep)
  const changeOnboarding = useOnboard((store) => store.changeOnboarding)

  const { getNode } = useLoad()
  const getBookmarks = useDataStore((state) => state.getBookmarks)
  const addBookmarks = useDataStore((state) => state.addBookmarks)

  const addILink = useDataStore((store) => store.addILink)
  const addTag = useDataStore((store) => store.addTag)
  const loadTourNode = useEditorStore((s) => s.loadNodeAndReplaceContent)
  const addSnippet = useSnippetStore((s) => s.addSnippet)

  const setServices = useSyncStore((store) => store.setServices)
  const setTemplates = useSyncStore((store) => store.setTemplates)

  const { updater } = useUpdater()
  const { execDelete } = useDelete()

  const isBookmark = (uid: string) => {
    const bookmarks = getBookmarks()
    return bookmarks.indexOf(uid) > -1
  }

  const onBoardServices = [
    {
      id: 'ONBOARD',
      name: 'ONBOARD',
      type: 'medium',
      imageUrl: 'https://workduck.io',
      description: 'Onboard users',
      authUrl: '',
      connected: true,
      enabled: true
    }
  ]

  const onBoardTempaltes = [
    {
      id: 'SYNCTEMP_ONBOARD',
      title: 'Flow Block Tour',
      command: 'onboard',
      description: 'This gives you a quick way to connect with mex demo',
      intents: [
        {
          service: 'ONBOARD',
          type: 'medium'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    },
    {
      id: 'SYNCTEMP_ISSUETRACKING',
      title: 'Issue Tracking',
      command: 'issuetracking',
      description: 'Track Issues',
      intents: [
        {
          service: 'GITHUB',
          type: 'issue'
        },
        {
          service: 'SLACK',
          type: 'channel'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    },
    {
      id: 'SYNCTEMP_TASK',
      title: 'Slack Task management',
      command: 'task',
      description: 'Manage tasks',
      intents: [
        {
          service: 'SLACK',
          type: 'channel'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    },
    {
      id: 'SYNCTEMP_DEVTASK',
      title: 'Github tasks',
      command: 'devtask',
      description: 'Create tasks using github issues',
      intents: [
        {
          service: 'GITHUB',
          type: 'issue'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    }
  ]

  const TOUR_SNIPPET_ID = `${SNIPPET_PREFIX}${ID_SEPARATOR}PRD`

  const createNode = (name: string) => {
    // * Create Quick link for Product Tour node
    const uid = addILink(name)
    const node = getNode(uid)

    loadTourNode(node, {
      type: 'something',
      content: tourNodeContent
    })

    return uid
  }

  const createTourNodes = (item: GettingStartedListProps) => {
    const productTourNode = ilinks.find((i) => i.text === 'Tour')

    if (!productTourNode?.uid) {
      // * Create nodes
      // * Create Quick link for Product Tour node
      addILink('Tour')
      /*
        - Tour
          - Quick Link
          - Snippet
          - Flow Link
      */
    }

    const uid = createNode(`Tour.${item.title}`)

    // * Create a Bookmark for the Product Road map node
    if (!isBookmark(uid)) addBookmarks([uid])
  }

  const createNewSnippet = () => {
    addSnippet({
      id: TOUR_SNIPPET_ID,
      title: 'PRD',
      content: snippetTourContent
    })

    updater()
  }

  // * Integration dummy data
  const setOnboardData = (item: GettingStartedListProps) => {
    // * Template and services
    // * Uncomment this if you want this in tour
    // setServices(onBoardServices)
    // setTemplates(onBoardTempaltes)

    // * One tag called 'onboard'
    addTag('onboard')

    // * Create node
    createTourNodes(item)

    // * Create a new snippet with some content
    const isTourSnippetPresent = snippets.find((s) => s.id === TOUR_SNIPPET_ID)
    if (!isTourSnippetPresent) createNewSnippet()
  }

  const removeOnboardData = () => {
    const remainingTemplates = onBoardTempaltes.filter((item) => !templates.includes(item))
    const remainingServices = onBoardServices.filter((item) => !services.includes(item))

    setTemplates(remainingTemplates)
    setServices(remainingServices)

    execDelete('Tour', { permanent: true })
  }

  const closeOnboarding = () => {
    setStep(0)
    removeOnboardData()
    changeOnboarding(false)
  }

  return { setOnboardData, removeOnboardData, closeOnboarding }
}
