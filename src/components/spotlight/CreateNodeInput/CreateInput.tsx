import NodeSelect from '../../../components/mex/NodeSelect/NodeSelect'

import React from 'react'
import { StyledSpotlightInputWrapper } from '../../../components/mex/NodeSelect/NodeSelect.styles'

export type CreateInputType = { value?: string; onChange }

const CreateInput: React.FC<CreateInputType> = ({ onChange }) => {
  return (
    <StyledSpotlightInputWrapper>
      <NodeSelect
        autoFocus
        id="wd-spotlight-editor-search"
        name="wd-spotlight-editor-search"
        placeholder="Something"
        handleSelectItem={onChange}
      />
    </StyledSpotlightInputWrapper>
  )
}

export default CreateInput
