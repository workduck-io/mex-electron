import React, { useState } from 'react'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { initActions } from '../../../data/Actions'
import List, { MAX_RECENT_ITEMS } from './components/List'
import useDataStore from '../../../store/useDataStore'
import { ListItemType } from '../SearchResults/types'
import { getListItemFromNode } from './helper'

const Home = () => {
  const [selectedItem, setSelectedItem] = useState<ListItemType>()

  const ilinks = useDataStore((state) => state.ilinks)
  const recents = useRecentsStore((state) => state.lastOpened)

  const recentList = recents.map((nodeid: string) => {
    const item = ilinks.find((link) => link?.nodeid === nodeid)

    const listItem: ListItemType = getListItemFromNode(item)
    return listItem
  })

  const recentLimit = recentList.length < MAX_RECENT_ITEMS ? recentList.length : MAX_RECENT_ITEMS
  const data = [...recentList.slice(0, recentLimit), ...initActions]

  return <List data={data} limit={recentLimit} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
}

export default Home
