import { rgba } from 'polished';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ActionMeta } from 'react-select';
import { css } from 'styled-components';
import tinykeys from 'tinykeys';
import useDataStore, { useFlatTreeFromILinks } from '../../Editor/Store/DataStore';
import { useEditorStore } from '../../Editor/Store/EditorStore';
import { getNodeFlatTree } from '../../Lib/flatTree';
import TreeNode from '../../Types/tree';
import LookupInput from '../NodeInput/NodeSelect';
import { Value } from '../NodeInput/Types';

export type LookupProps = {
  flatTree: TreeNode[];
};

/** Is added to Global Styles */
export const LookupStyles = css`
  .LookupContent {
    /* position: absolute; */
    width: max-content;
    height: max-content;
    margin: auto;
    background: ${({ theme }) => theme.colors.background.card};
    box-shadow: 0px 20px 100px ${({ theme }) => theme.colors.gray.sb};
    overflow: auto;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    outline: none;
    padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
    min-height: 440px;
    min-width: 400px;
  }
  .LookupOverlay {
    position: fixed;
    inset: 0px;
    display: flex;
    background-color: ${({ theme }) => rgba(theme.colors.palette.black, 0.5)};
  }
`;

const Lookup: React.FC<LookupProps> = () => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
    // searchInput.current.focus();
  };

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyL': event => {
        event.preventDefault();
        openModal();
      },
    });
    return () => {
      unsubscribe();
    };
  });

  const loadNode = useEditorStore(s => s.loadNode);
  const loadNodeFromId = useEditorStore(s => s.loadNodeFromId);
  const addILink = useDataStore(s => s.addILink);

  const flattree = useFlatTreeFromILinks();
  // console.log({ flatTree, open });

  const handleChange = (
    newValue: Value | null,
    _actionMeta: ActionMeta<Value> // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    // setState({ ...state, value: newValue });
    if (newValue) {
      const node = getNodeFlatTree(newValue.value, flattree);
      if (node.length > 0) {
        loadNode(node[0]);
      }
    }
    closeModal();
  };

  const handleCreate = (inputValue: string) => {
    addILink(inputValue);
    loadNodeFromId(inputValue);
    closeModal();
  };

  return (
    <Modal className="LookupContent" overlayClassName="LookupOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1>Lookup</h1>
      <LookupInput autoFocus menuOpen handleChange={handleChange} handleCreate={handleCreate} />
    </Modal>
  );
};

export default Lookup;
