import { rgba } from 'polished';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ActionMeta } from 'react-select';
import { css } from 'styled-components';
import tinykeys from 'tinykeys';
import { useRefactor } from '../../Editor/Actions/useRefactor';
import { Button } from '../../Styled/Buttons';
import LookupInput from '../NodeInput/NodeSelect';
import { Value } from '../NodeInput/Types';

export const RefactorStyles = css`
  .RefactorContent {
    /* position: absolute; */
    width: max-content;
    height: max-content;
    margin: auto;
    background: ${({ theme }) => theme.colors.background.card};
    box-shadow: 0px 20px 100px ${({ theme }) => theme.colors.gray.sb};
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

const Refactor = () => {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);
  const [mockRefactored, setMockRefactored] = useState<
    {
      from: string;
      to: string;
    }[]
  >([]);

  const openModal = () => {
    setOpen(true);
    // searchInput.current.focus();
  };

  const closeModal = () => {
    setFrom(undefined);
    setTo(undefined);
    setMockRefactored([]);
    setOpen(false);
  };

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyR': event => {
        event.preventDefault();
        openModal();
      },
    });
    return () => {
      unsubscribe();
    };
  });

  // console.log({ flatTree, open });

  const handleFromChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue;
      setFrom(value);
    }
  };

  const handleToChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue;
      setTo(value);
    }
  };

  const handleToCreate = (inputValue: string) => {
    if (inputValue) {
      setTo(inputValue);
    }
  };

  const { getMockRefactor, execRefactor } = useRefactor();

  useEffect(() => {
    // console.log({ to, from });
    if (to && from) {
      setMockRefactored(getMockRefactor(from, to));
    }
  }, [to, from, getMockRefactor]);

  // console.log({ mockRefactored });

  const handleRefactor = () => {
    if (to && from) execRefactor(from, to);
  };

  return (
    <Modal className="RefactorContent" overlayClassName="RefactorOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1>Refactor</h1>
      <br />
      <h2>From</h2>
      <LookupInput menuOpen autoFocus handleChange={handleFromChange} />

      <br />
      <h2>To</h2>
      <LookupInput handleChange={handleToChange} handleCreate={handleToCreate} />

      {mockRefactored.length > 0 && <h1>Nodes being refactored:</h1>}
      {mockRefactored.map(t => (
        <div key={`MyKeys_${t.from}`}>
          <p>From: {t.from}</p>
          <p>To: {t.to}</p>
        </div>
      ))}
      <p>Ok</p>
      <Button onClick={handleRefactor}>Apply Refactor</Button>
    </Modal>
  );
};

export default Refactor;
