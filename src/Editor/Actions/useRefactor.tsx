import React from 'react';
import { Contents, useContentStore } from '../Store/ContentStore';
import useDataStore from '../Store/DataStore';

export const useRefactor = () => {
  const ilinks = useDataStore(state => state.ilinks);
  const contents = useContentStore(state => state.contents);

  /*  Notes:
  We need to refactor all ilinks that match with the given regex and replace the initial regex with the refactorId

  Then we need to remap the contents to the new IDs.

  We will return two functions, first that returns the list of refactoring, the second function applies the refactoring 
  
  getMockRefactor is used to get a preview of the links that will be refactored.
  execRefactor will apply the refactor action.
  */

  const setILinks = useDataStore(state => state.setIlinks);
  const initContents = useContentStore(state => state.initContents);

  const getMockRefactor = (from: string, to: string): { from: string; to: string }[] => {
    const refactorMap = ilinks.filter(i => {
      const match = i.text.startsWith(from);

      // console.log('Trying matches', i.text, from, match, i.text.startsWith(from));
      return match;
    });

    const refactored = refactorMap.map(f => {
      return {
        from: f.text,
        to: f.text.replace(from, to),
      };
    });

    return refactored;
  };

  const execRefactor = (from: string, to: string) => {
    const refactored = getMockRefactor(from, to);

    // Generate the new links
    const newIlinks = ilinks.map(i => {
      for (const ref of refactored) {
        if (ref.from === i.text) {
          return {
            ...i,
            text: ref.to,
            key: ref.to,
          };
        }
      }
      return i;
    });

    // Remap the contents with changed links
    const newContents: Contents = {};
    Object.keys(contents).forEach(key => {
      const content = contents[key];
      let isRef = false;
      for (const ref of refactored) {
        if (ref.from === key) {
          newContents[ref.to] = content;
          isRef = true;
        }
      }
      if (!isRef) newContents[key] = content;
    });

    setILinks(newIlinks);
    initContents(newContents);
  };

  return { getMockRefactor, execRefactor };
};

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withRefactor = (Component: any) => {
  return function C2(props: any) {
    const { getMockRefactor, execRefactor } = useRefactor();

    return <Component getMockRefactor={getMockRefactor} execRefactor={execRefactor} {...props} />; // eslint-disable-line react/jsx-props-no-spreading
  };
};
