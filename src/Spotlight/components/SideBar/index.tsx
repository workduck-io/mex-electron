/* eslint-disable react/prop-types */
import React from 'react'
import Actions from '../Actions'
import SearchResults from '../SearchResults'

const SideBar: React.FC<{ index: number; data: Array<any> | undefined }> = ({ index, data }) => {
  if (data) {
    return <SearchResults current={index} data={data} />
  }

  return <Actions current={index} />
}

export default SideBar
