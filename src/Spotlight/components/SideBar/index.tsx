/* eslint-disable react/prop-types */
import React from 'react'
import SearchResults from '../SearchResults'

const SideBar: React.FC<{ index: number; data: Array<any> | undefined }> = ({ index, data }) => {
  return <SearchResults current={index} data={data} />
}

export default SideBar
