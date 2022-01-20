import React from 'react'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { StyledSearch } from '../Search/styled'
import { CenterIcon } from '../../../Spotlight/styles/layout'
import WDLogo from '../Search/Logo'
import Message from '../Message'

import CreateInput from './CreateInput'

const CreateNodeInput = () => {
  const saved = useContentStore((state) => state.saved)

  return (
    <StyledSearch>
      <CreateInput />
      {saved && <Message text="Saved" />}
      <CenterIcon>
        <WDLogo />
      </CenterIcon>
    </StyledSearch>
  )
}

export default CreateNodeInput
