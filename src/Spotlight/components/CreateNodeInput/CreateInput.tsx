import React, { useState } from 'react'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { SelectState } from '../../../Components/NodeInput/NodeSelect'
import { useFlatTreeFromILinks } from '../../../Editor/Store/DataStore'
import { getOptions } from '../../../Lib/flatTree'

import { StyledCreateInput } from '../Search/styled'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'

const CreateInput: React.FC<{ placeholder: string; defaultValue?: string; onCreate: (nodeID: string) => void }> = ({
  placeholder,
  onCreate
}) => {
  const defaultOptions = getOptions(useFlatTreeFromILinks())

  const loadNodeAndAppend = useEditorStore((s) => s.loadNodeAndAppend)
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  const handleOnCreateNexMex = (val: string) => {
    onCreate(val)
    setInputState((s) => ({ ...s, value: { label: val, value: val } }))
  }

  const [inputState, setInputState] = useState<SelectState>({
    options: defaultOptions,
    value: undefined
  })

  const handleChange = (newValue: any, actionMeta: any) => {
    setInputState((s) => ({ ...s, value: newValue }))
    loadNodeAndAppend(newValue.value, nodeContent)
  }

  const handleInputChange = (inputValue: any, actionMeta: any) => {
    setInputState((s) => ({ ...s, value: inputValue }))
  }

  return (
    <StyledCreateInput
      placeholder={placeholder}
      isClearable
      onCreateOption={handleOnCreateNexMex}
      options={inputState.options}
      value={inputState.value}
      onChange={handleChange}
      onInputChange={handleInputChange}
    />
  )
}

export default CreateInput
