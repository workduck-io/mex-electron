/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import Home from '../../../components/spotlight/Home'
import { initActions } from '../../../data/Actions'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { insertItemInArray } from '../../../utils/lib/helper'
import { MAX_RECENT_ITEMS } from '../Home/components/List'
import { getListItemFromNode } from '../Home/helper'
import { CREATE_NEW_ITEM, useSearch } from '../Home/useSearch'
import { ListItemType } from '../SearchResults/types'

const SideBar = () => {
  // * Store
  const ilinks = useDataStore((s) => s.ilinks)
  const lastOpenedNodes = useRecentsStore((store) => store.lastOpened)
  const recentResearchNodes = useRecentsStore((store) => store.recentResearchNodes)

  // * Custom hooks
  const { searchInList } = useSearch()
  const { search, selection, activeItem, searchResults, setSearchResults } = useSpotlightContext()

  // * Set the result list
  useEffect(() => {
    if (!activeItem?.item) {
      if (search.value) {
        const listWithNew = searchInList()
        setSearchResults(listWithNew)
      } else {
        // * Get those recent node links which exists locally
        const recents = selection ? recentResearchNodes : lastOpenedNodes
        const items = recents.filter((recent: string) => ilinks.find((ilink) => ilink.nodeid === recent))

        const recentList = items
          .map((nodeid: string) => {
            const item = ilinks.find((link) => link?.nodeid === nodeid)

            const listItem: ListItemType = getListItemFromNode(item)
            return listItem
          })
          .reverse()

        const recentLimit = recentList.length < MAX_RECENT_ITEMS ? recentList.length : MAX_RECENT_ITEMS
        const limitedList = recentList.slice(0, recentLimit)

        const list = !recentLimit ? [CREATE_NEW_ITEM] : insertItemInArray(limitedList, CREATE_NEW_ITEM, 1)
        const data = [...list, ...initActions]
        setSearchResults(data)
      }
    }
    // else {
    //   setSearchResults([activeItem.item])
    // }
  }, [search.value, selection, activeItem.item, ilinks])

  return <Home data={searchResults} />
}

export default SideBar
