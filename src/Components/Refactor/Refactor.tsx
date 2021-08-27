import arrowRightLine from '@iconify-icons/ri/arrow-right-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ActionMeta } from 'react-select'
import tinykeys from 'tinykeys'
import create from 'zustand'
import { useRefactor } from '../../Editor/Actions/useRefactor'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { NodeLink } from '../../Types/relations'
import LookupInput from '../NodeInput/NodeSelect'
import { Value } from '../NodeInput/Types'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

// Prefill modal has been added to the Tree via withRefactor from useRefactor

interface RefactorState {
  open: boolean
  focus: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  to: string | undefined
  openModal: () => void
  closeModal: () => void
  setMockRefactored: (mR: NodeLink[]) => void
  setFocus: (focus: boolean) => void
  setFrom: (from: string) => void
  setTo: (from: string) => void
  prefillModal: (from: string, to: string) => void
}

export const useRefactorStore = create<RefactorState>((set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  to: undefined,
  focus: true,
  openModal: () =>
    set({
      open: true
    }),
  closeModal: () => {
    set({
      from: undefined,
      to: undefined,
      mockRefactored: [],
      open: false
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  setMockRefactored: (mockRefactored: NodeLink[]) => {
    set({ mockRefactored })
  },
  setFrom: (from: string) => set({ from }),
  setTo: (to: string) => set({ to }),
  prefillModal: (from: string, to: string) =>
    set({
      from,
      to,
      open: true,
      focus: false
    })
}))

const Refactor = () => {
  const open = useRefactorStore((store) => store.open)
  const focus = useRefactorStore((store) => store.focus)
  const to = useRefactorStore((store) => store.to)
  const from = useRefactorStore((store) => store.from)
  const mockRefactored = useRefactorStore((store) => store.mockRefactored)

  const openModal = useRefactorStore((store) => store.openModal)
  const closeModal = useRefactorStore((store) => store.closeModal)
  const setMockRefactored = useRefactorStore((store) => store.setMockRefactored)
  const setTo = useRefactorStore((store) => store.setTo)
  const setFrom = useRefactorStore((store) => store.setFrom)

  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyR': (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  const handleFromChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setFrom(value)
    }
  }

  const handleToChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setTo(value)
    }
  }

  const handleToCreate = (inputValue: string) => {
    if (inputValue) {
      setTo(inputValue)
    }
  }

  const { getMockRefactor, execRefactor } = useRefactor()

  useEffect(() => {
    // console.log({ to, from });
    if (to && from) {
      setMockRefactored(getMockRefactor(from, to))
    }
  }, [to, from])

  // console.log({ mockRefactored });

  const handleRefactor = () => {
    const res = execRefactor(from, to)
    const nodeId = useEditorStore.getState().node.id
    if (doesLinkRemain(nodeId, res)) {
      loadNodeFromId(nodeId)
    } else if (res.length > 0) {
      loadNodeFromId(res[0].to)
    }
    closeModal()
  }

  return (
    <Modal className="RefactorContent" overlayClassName="RefactorOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Refactor</ModalHeader>

      <LookupInput
        defaultValue={from}
        placeholder="Refactor From Node..."
        menuOpen={focus}
        autoFocus={focus}
        handleChange={handleFromChange}
      />

      <LookupInput
        defaultValue={to}
        placeholder="Refactor To Node..."
        handleChange={handleToChange}
        handleCreate={handleToCreate}
      />

      {mockRefactored.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Nodes being refactored... </h1>
            <p>{mockRefactored.length} changes</p>
          </MRMHead>
          {mockRefactored.map((t) => (
            <MRMRow key={`MyKeys_${t.from}`}>
              <p>{t.from}</p>
              <ArrowIcon>
                <Icon icon={arrowRightLine}> </Icon>
              </ArrowIcon>
              <p>{t.to}</p>
            </MRMRow>
          ))}
        </MockRefactorMap>
      )}
      <ModalControls>
        <Button primary autoFocus={!focus} size="large" onClick={handleRefactor}>
          Apply Refactor
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Refactor
