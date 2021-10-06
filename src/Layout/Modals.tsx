import React from 'react'
import HelpModal from '../Components/Help/HelpModal'
import Lookup from '../Components/Lookup'
import Delete from '../Components/Refactor/DeleteModal'
import Refactor from '../Components/Refactor/Refactor'
import Rename from '../Components/Refactor/Rename'

const Modals = () => (
  <>
    <Lookup />
    <Refactor />
    <Rename />
    <Delete />
    <HelpModal />
  </>
)

export default Modals
