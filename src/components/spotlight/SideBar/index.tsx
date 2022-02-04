/* eslint-disable react/prop-types */
import React from 'react'
import Home from '../Home'
import Recent from '../Recent'
import SearchResults from '../SearchResults'

const SideBar: React.FC<{ index: number; data: Array<any> | undefined }> = ({ index, data }) => {
  if (data) return <SearchResults current={index} data={data} />
  return <Home />
}

export default SideBar
