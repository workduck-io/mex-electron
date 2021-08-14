/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import { ipcRenderer } from 'electron';
import tinykeys from 'tinykeys';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const useLocalShortcuts = () => {
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault();
        ipcRenderer.send('close');
      },
      Tab: (event) => {
        event.preventDefault();
        history.push('/new');
      },
    });
    return () => {
      unsubscribe();
    };
  });
};

type SpotlightContextType = {
  search: string;
  setSearch: (val: any) => void;
  selection: any;
  setSelection: (val: any) => void;
};

const SpotlightContext = createContext<SpotlightContextType>(undefined!);

export const SpotlightProvider: React.FC = ({ children }) => {
  const [search, setSearch] = useState<string>('');
  const [selection, setSelection] = useState<any>();

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
  };

  useEffect(() => {
    ipcRenderer.on('selected-text', (event, data) => {
      setSelection(data);
    });
  }, []);

  return (
    <SpotlightContext.Provider value={value}>
      {children}
    </SpotlightContext.Provider>
  );
};

export const useSpotlightContext = () => useContext(SpotlightContext);
