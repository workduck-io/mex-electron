import { rgba } from 'polished';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ActionMeta } from 'react-select';
import { useEditorStore, withLoadNode } from '../../Editor/Store/EditorStore';
import { css } from 'styled-components';
import tinykeys from 'tinykeys';
import { useRefactor } from '../../Editor/Actions/useRefactor';
import { Button } from '../../Styled/Buttons';
import LookupInput from '../NodeInput/NodeSelect';
import { Value } from '../NodeInput/Types';
import { useDelete } from '../../Editor/Actions/useDelete';

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
`;

interface DeleteState {
  open: boolean;
  defDel: { label: string; value: string };
  del: string;
  mockData: string[];
}

const Delete = () => {
  const { getMockDelete, execDelete } = useDelete();
  const loadNodeFromId = useEditorStore(state => state.loadNodeFromId);

  const [deleteState, setDeleteState] = useState<DeleteState>({
    open: false,
    del: '',
    defDel: {
      label: '',
      value: '',
    },
    mockData: [],
  });

  const openModal = () => {
    const nodeId = useEditorStore.getState().node.id;
    setDeleteState({
      open: true,
      defDel: {
        value: nodeId,
        label: nodeId,
      },
      del: nodeId,
      mockData: getMockDelete(nodeId),
    });
  };

  const closeModal = () => {
    setDeleteState({
      open: false,
      del: '',
      defDel: {
        value: '',
        label: '',
      },
      mockData: [],
    });
  };

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyD': event => {
        event.preventDefault();
        openModal();
      },
    });
    return () => {
      unsubscribe();
    };
  });

  // console.log({ to, from, open });

  const handleDeleteChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue;
      setDeleteState({
        ...deleteState,
        del: value,
        mockData: getMockDelete(value),
      });
    }
  };

  // useEffect(() => {
  //   // console.log({ to, from });
  //   if (to && from) {
  //     // setMockRename(getMockRefactor(from, to));
  //   }
  // }, [to, from, getMockRefactor]);

  // console.log({ mockRefactored });

  const { del, defDel, mockData, open } = deleteState;

  const handleDelete = () => {
    const { newLinks } = execDelete(del);
    if (newLinks.length > 0) loadNodeFromId(newLinks[0].text);
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <Modal className="RefactorContent" overlayClassName="RefactorOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1>Rename</h1>
      <br />
      <h2>Delete Node:</h2>
      <LookupInput autoFocus defaultValue={defDel} handleChange={handleDeleteChange} />

      {del !== '' && (
        <>
          <h1>Please confirm deleting the node(s):</h1>
          <div>
            {mockData.map(d => (
              <p>{d}</p>
            ))}
          </div>
        </>
      )}
      <Button onClick={handleDelete}>Delete</Button>
      <Button onClick={handleCancel}>Cancel Culture</Button>
    </Modal>
  );
};

export default Delete;
