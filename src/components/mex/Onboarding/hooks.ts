// import { useSyncStore } from '../../Editor/Store/useSyncStore'

import useDataStore from '../../../store/useDataStore'
import { useSyncStore } from '../../../store/useSyncStore'
import {
  flowLinkNodeContent,
  onBoardServices,
  onBoardTempaltes,
  quickLinkNodeContent,
  snippetTourContent
} from './tourNode'
import useLoad from '../../../hooks/useLoad'
import { ID_SEPARATOR, SNIPPET_PREFIX } from '../../../data/Defaults/idPrefixes'
import { useSnippetStore } from '../../../store/useSnippetStore'
import { useUpdater } from '../../../hooks/useUpdater'
import useOnboard from '../../../store/useOnboarding'

import { GettingStartedListProps } from './components/GettingStarted'
import { useDelete } from '../../../hooks/useDelete'
import { USE_API } from '../../../data/Defaults/dev_'
import { mog } from '../../../utils/lib/helper'
import { useContentStore } from '../../../store/useContentStore'
import { useLinks } from '../../../hooks/useLinks'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../../data/IpcAction'
import { AppType } from '../../../hooks/useInitialize'

const TOUR_SNIPPET_ID = `${SNIPPET_PREFIX}${ID_SEPARATOR}PRD`

export const useOnboardingData = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const snippets = useSnippetStore((store) => store.snippets)

  const setStep = useOnboard((store) => store.setStep)
  const changeOnboarding = useOnboard((store) => store.changeOnboarding)

  const { loadNode } = useLoad()
  const { getUidFromNodeId } = useLinks()
  const getBookmarks = useDataStore((state) => state.getBookmarks)
  const addBookmarks = useDataStore((state) => state.addBookmarks)

  const addILink = useDataStore((store) => store.addILink)
  const addTag = useDataStore((store) => store.addTag)
  const addSnippet = useSnippetStore((s) => s.addSnippet)
  const deleteSnippet = useSnippetStore((s) => s.deleteSnippet)
  const setOnboardBackup = useOnboard((s) => s.setOnboardBackup)

  const setServices = useSyncStore((store) => store.setServices)
  const setTemplates = useSyncStore((store) => store.setTemplates)
  const setContent = useContentStore((state) => state.setContent)

  const { updater } = useUpdater()
  const { execDelete } = useDelete()

  const isBookmark = (uid: string) => {
    const bookmarks = getBookmarks()
    return bookmarks.indexOf(uid) > -1
  }

  const loadTourNode = (name: string) => {
    const uid = getUidFromNodeId(name)
    loadNode(uid, { fetch: false, savePrev: false })
  }

  const createTourNodes = (item: GettingStartedListProps) => {
    const productTourNode = ilinks.find((i) => i.path === 'Tour')

    if (!productTourNode?.nodeid) {
      // * Create Quick link for Product Tour node
      let uid

      switch (item.title) {
        case 'Quick Links':
          uid = addILink('Tour.Quick Links')
          setContent(uid, quickLinkNodeContent)

        // eslint-disable-next-line no-fallthrough
        case 'Snippets':
          uid = addILink('Tour.Snippets')
          setContent(uid, snippetTourContent)

          // if (location.pathname !== '/snippets') history.push('/snippets')
          // * Create a Bookmark for the Product Road map node
          if (!isBookmark(uid)) addBookmarks([uid])

        // eslint-disable-next-line no-fallthrough
        case 'Flow Links':
          uid = addILink('Tour.Flow Links')
          setContent(uid, flowLinkNodeContent)
          break

        case 'Quick Capture':
          ipcRenderer.send(IpcAction.START_ONBOARDING, { from: AppType.MEX, data: { isOnboarding: true } })
          break
        default:
          mog('What are you trying to do ???', { item }, { collapsed: true })
      }
    }

    if (item.title !== 'Quick Capture') loadTourNode(`Tour.${item.title}`)
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

    // * One tag called 'onboard'
    addTag('onboard')

    // * Create node
    createTourNodes(item)

    // * Create a new snippet with some content
    const isTourSnippetPresent = snippets.find((s) => s.id === TOUR_SNIPPET_ID)
    if (!isTourSnippetPresent) createNewSnippet()

    setServices(onBoardServices)
    setTemplates(onBoardTempaltes)
  }

  const removeOnboardData = () => {
    const onboardBackup = useOnboard.getState().onboardBackup

    mog('removeOnboardData', { onboardBackup })

    if (onboardBackup) {
      setServices(onboardBackup.services)
      setTemplates(onboardBackup.templates)

      setOnboardBackup(undefined)
    }

    deleteSnippet(TOUR_SNIPPET_ID)
    updater()

    const { newLinks } = execDelete('Tour', { permanent: true })

    if (newLinks.length > 0) loadNode(newLinks[0].nodeid, { savePrev: false, fetch: USE_API() })

    ipcRenderer.send(IpcAction.STOP_ONBOARDING, { from: AppType.MEX, data: { isOnboarding: false } })
  }

  const closeOnboarding = () => {
    setStep(0)
    removeOnboardData()
    changeOnboarding(false)
  }

  return { setOnboardData, removeOnboardData, closeOnboarding }
}
