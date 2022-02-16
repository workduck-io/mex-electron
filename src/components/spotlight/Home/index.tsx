import React from 'react'
import List from './components/List'
import { ListItemType } from '../SearchResults/types'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'

const Home = ({ data }: { data: Array<ListItemType> }) => {
  const { setActiveItem, activeItem } = useSpotlightContext()

  return <List data={data} selectedItem={activeItem} setSelectedItem={setActiveItem} />
}

export default Home
