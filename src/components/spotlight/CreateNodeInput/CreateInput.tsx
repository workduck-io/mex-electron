import NodeSelect from '../../../components/mex/NodeSelect/NodeSelect'

import React from 'react'
import { StyledSpotlightInputWrapper } from '../../../components/mex/NodeSelect/NodeSelect.styles'

export type CreateInputType = { value?: string; onChange; disabled?: boolean }

const CreateInput: React.FC<CreateInputType> = ({ onChange, value, disabled }) => {
  return (
    <StyledSpotlightInputWrapper>
      <NodeSelect
        autoFocus
        disabled={disabled}
        defaultValue={value}
        id="wd-spotlight-editor-search"
        name="wd-spotlight-editor-search"
        placeholder="Search for a note"
        handleSelectItem={onChange}
      />
    </StyledSpotlightInputWrapper>
  )
}

export default CreateInput
