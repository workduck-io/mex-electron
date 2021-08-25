import { rgba } from 'polished'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ActionMeta } from 'react-select'
import { useEditorStore, withLoadNode } from '../../Editor/Store/EditorStore'
import { css } from 'styled-components'
import tinykeys from 'tinykeys'
import { useRefactor } from '../../Editor/Actions/useRefactor'
import { Button } from '../../Styled/Buttons'
import LookupInput from '../NodeInput/NodeSelect'
import { Value } from '../NodeInput/Types'

export const RefactorStyles = css`
  .RefactorContent {
    /* position: absolute; */
    width: max-content;
    height: max-content;
    margin: auto;
    background: ${({ theme }) => theme.colors.background.card};
    box-shadow: 0px 20px 100px ${({ theme }) => theme.colors.gray[9]};
    overflow: visible;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    outline: none;
    padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
    min-height: 240px;
    min-width: 400px;
  }
  .RefactorOverlay {
    position: fixed;
    inset: 0px;
    display: flex;
    background-color: ${({ theme }) => rgba(theme.colors.palette.black, 0.5)};
  }
`

interface RenameState {
  open: boolean
  from: string
  to: string
  defFrom: { label: string; value: string }
}

const Rename = () => {
  const { execRefactor } = useRefactor()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)

  const [renameState, setRenameState] = useState<RenameState>({
    open: false,
    from: '',
    to: '',
    defFrom: {
      label: '',
      value: '',
    },
  })

  const openModal = () => {
    const nodeId = useEditorStore.getState().node.id
    setRenameState({
      open: true,
      from: nodeId,
      defFrom: {
        value: nodeId,
        label: nodeId,
      },
      to: '',
    })
  }

  const closeModal = () => {
    setRenameState({
      open: false,
      from: '',
      defFrom: {
        value: '',
        label: '',
      },
      to: '',
    })
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyN': (event) => {
        event.preventDefault()
        openModal()
      },
    })
    return () => {
      unsubscribe()
    }
  })

  // console.log({ to, from, open });

  const handleFromChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setRenameState({
        ...renameState,
        from: value,
      })
    }
  }

  const handleToChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setRenameState({
        ...renameState,
        to: value,
      })
    }
  }

  const handleToCreate = (inputValue: string) => {
    if (inputValue) {
      setRenameState({
        ...renameState,
        to: inputValue,
      })
    }
  }

  // useEffect(() => {
  //   // console.log({ to, from });
  //   if (to && from) {
  //     // setMockRename(getMockRefactor(from, to));
  //   }
  // }, [to, from, getMockRefactor]);

  // console.log({ mockRefactored });

  const { from, to, defFrom, open } = renameState

  const handleRefactor = () => {
    if (to && from) {
      const res = execRefactor(from, to)
      console.log(res)

      if (res.length > 0) {
        loadNodeFromId(res[0].to)
      }
    }
    closeModal()
  }

  return (
    <Modal className="RefactorContent" overlayClassName="RefactorOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1>Rename</h1>
      <br />
      <h2>From</h2>
      <LookupInput defaultValue={defFrom} handleChange={handleFromChange} />

      <br />
      <h2>To</h2>
      <LookupInput autoFocus menuOpen handleChange={handleToChange} handleCreate={handleToCreate} />

      {from !== '' && (
        <>
          <h1>Node rename:</h1>
          <div>
            <p>From: {from}</p>
            <p>To: {to}</p>
          </div>
        </>
      )}
      <Button onClick={handleRefactor}>Rename</Button>
    </Modal>
  )
}

export default Rename
