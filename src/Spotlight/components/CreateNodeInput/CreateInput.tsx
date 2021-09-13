import React, { useState } from 'react'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { SelectState } from '../../../Components/NodeInput/NodeSelect'
import { useFlatTreeFromILinks } from '../../../Editor/Store/DataStore'
import { getOptions } from '../../../Lib/flatTree'

import { StyledCreateInput } from '../Search/styled'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { useNavigation } from '../../../Hooks/useNavigation/useNavigation'

const CreateInput: React.FC<{ placeholder: string; defaultValue?: string; onCreate: (nodeID: string) => void }> = ({
  placeholder,
  onCreate
}) => {
  const defaultOptions = getOptions(useFlatTreeFromILinks())

  const { push } = useNavigation()
  const loadNodeAndAppend = useEditorStore((s) => s.loadNodeAndAppend)
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  const handleOnCreateNexMex = (val: any) => {
    const newVal = { label: val, value: val }
    onCreate(val)
    setInputState((s) => ({ options: [...s.options, newVal], value: newVal }))
  }

  const [inputState, setInputState] = useState<SelectState>({
    options: defaultOptions,
    value: undefined
  })

  const handleChange = (newValue: any, actionMeta: any) => {
    if (nodeContent) {
      loadNodeAndAppend(newValue.value, nodeContent)
    } else {
      push(newValue.value)
    }
    setInputState((s) => ({ ...s, value: newValue }))
  }

  return (
    <StyledCreateInput
      blurInputOnSelect
      placeholder={placeholder}
      isClearable
      onCreateOption={handleOnCreateNexMex}
      options={inputState.options}
      value={inputState.value}
      onChange={handleChange}
    />
  )
}

export default CreateInput
