/* eslint-disable react/prop-types */
import React from 'react'
import { Result } from '../SearchResults'

const Recent: React.FC<{ current: number; recents: Array<any> }> = ({ current, recents }) => {
  return (
    <div>
      {recents?.map((data: any, index) => (
        <Result selected={index + 2 === current} key={data?.title} result={data} />
      ))}
    </div>
  )
}

export default Recent
