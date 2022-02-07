import React, { useState } from 'react'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { initActions } from '../../../data/Actions'
import List, { MAX_RECENT_ITEMS } from './components/List'
import useDataStore from '../../../store/useDataStore'
import { ListItemType } from '../SearchResults/types'
import { getListItemFromNode } from './helper'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'

const Home = ({ data, limit }: { data: Array<ListItemType>; limit: number }) => {
  const [selectedItem, setSelectedItem] = useState<ListItemType>()

  return <List data={data} limit={limit} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
}

export default Home
