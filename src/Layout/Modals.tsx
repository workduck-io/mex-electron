import React from 'react'

import Lookup from '../Components/Lookup'
import Delete from '../Components/Refactor/DeleteModal'
import Refactor from '../Components/Refactor/Refactor'
import Rename from '../Components/Refactor/Rename'
import Tree from '../Components/Sidebar/treeUtils'

const Modals = () => (
  <>
    <Lookup flatTree={Tree} />
    <Refactor />
    <Rename />
    <Delete />
  </>
)

export default Modals
