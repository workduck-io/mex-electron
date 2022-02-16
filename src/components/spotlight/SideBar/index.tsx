/* eslint-disable react/prop-types */
import React from 'react'
import Home from '../../../components/spotlight/Home'
import { ListItemType } from '../SearchResults/types'

const SideBar: React.FC<{ index: number; data: Array<ListItemType> }> = ({ data }) => {
  return <Home data={data} />
}

export default SideBar
