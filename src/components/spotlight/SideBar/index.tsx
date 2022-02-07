/* eslint-disable react/prop-types */
import React from 'react'
import Home from '../../../components/spotlight/Home'
import Recent from '../Recent'
import SearchResults from '../SearchResults'
import { ListItemType } from '../SearchResults/types'

const SideBar: React.FC<{ index: number; data: Array<ListItemType>; recentLimit: number }> = ({
  data,
  recentLimit
}) => {
  return <Home data={data} limit={recentLimit} />
}

export default SideBar
