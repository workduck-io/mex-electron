import NodeSelect from '../../../components/mex/NodeSelect/NodeSelect'

import React from 'react'
import { StyledSpotlightInputWrapper } from '../../../components/mex/NodeSelect/NodeSelect.styles'

export type CreateInputType = {
  value?: { path: string; namespace: string }
  onChange
  disabled?: boolean
  autoFocus?: boolean
}

const CreateInput: React.FC<CreateInputType> = ({ autoFocus, onChange, value, disabled }) => {
  return (
    <StyledSpotlightInputWrapper>
      <NodeSelect
        autoFocus={autoFocus}
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
