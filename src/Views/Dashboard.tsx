import React from 'react'
import Search from '../Components/Search/Search'

export type DashboardProps = {
  title?: string
}

const Dashboard: React.FC<DashboardProps> = () => {
  return <>
    <Search />
    </>
}

export default Dashboard
