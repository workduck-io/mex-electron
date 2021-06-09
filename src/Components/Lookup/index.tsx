import { rgba } from 'polished';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { css } from 'styled-components';
import tinykeys from 'tinykeys';
import TreeNode from '../../Types/tree';
import LookupInput from './NodeSelect';

export type LookupProps = {
  flatTree: TreeNode[];
};

export const LookupStyles = css`
  .LookupContent {
    /* position: absolute; */
    width: max-content;
    height: max-content;
    margin: auto;
    background: ${({ theme }) => theme.colors.background.card};
    box-shadow: 0px 20px 100px ${({ theme }) => theme.colors.palette.black};
    overflow: auto;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    outline: none;
    padding: ${({ theme }) => theme.spacing.large};
    min-height: 400px;
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
      '$mod+KeyL': (event) => {
        event.preventDefault();
        openModal();
      },
    });
    return () => {
      unsubscribe();
    };
  });

  // console.log({ flatTree, open });

  return (
    <Modal
      className="LookupContent"
      overlayClassName="LookupOverlay"
      onRequestClose={closeModal}
      isOpen={open}
    >
      <h1>Lookup</h1>
      <LookupInput />
    </Modal>
  );
};

export default Lookup;
