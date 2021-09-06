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
  const loadNodeFromId = useEditorStore((s) => s.loadNodeFromId)
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  const handleOnCreateNexMex = (val: string) => {
    const newVal = { label: val, value: val }
    onCreate(val)
    setInputState((s) => ({ options: [...s.options, newVal], value: newVal }))
  }

  const [inputState, setInputState] = useState<SelectState>({
    options: defaultOptions,
    value: undefined
  })

  const handleChange = (newValue: any, actionMeta: any) => {
    setInputState((s) => ({ ...s, value: newValue }))
    if (nodeContent) {
      loadNodeAndAppend(newValue.value, nodeContent)
    } else {
      loadNodeFromId(newValue.value)
    }
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
