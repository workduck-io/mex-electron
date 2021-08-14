import { Contents, useContentStore } from '../Store/ContentStore';
import useDataStore from '../Store/DataStore';

export const useRefactor = () => {
  const ilinks = useDataStore(state => state.ilinks);
  const contents = useContentStore(state => state.contents);

  /* 
  
  We need to refactor all ilinks that match with the given regex and replace the initial regex with the refactorId

  Then we need to remap the contents to the new IDs.

  We will return two functions, first that returns the list of refactoring, the second function applies the refactoring 
  
  */

  const setILinks = useDataStore(state => state.setIlinks);
  const initContents = useContentStore(state => state.initContents);

  const getMockRefactor = (from: string, to: string): { from: string; to: string }[] => {
    // const re = new RegExp(from);
    const refactorMap = ilinks.filter(i => {
      const match = i.raw_id.startsWith(from);
      // if (match) {
      //   console.log('Match', { match });
      // }

      // console.log('Trying matches', i.text, from, match, i.text.startsWith(from));
      return match;
    });

    const refactored = refactorMap.map(f => {
      return {
        from: f.raw_id,
        to: f.raw_id.replace(from, to),
      };
    });

    return refactored;
  };

  const execRefactor = (from: string, to: string) => {
    // const re = new RegExp(from);
    const refactorMap = ilinks.filter(i => {
      const match = i.raw_id.startsWith(from);
      return match;
    });

    const refactored = refactorMap.map(f => {
      return {
        from: f.raw_id,
        to: f.raw_id.replace(from, to),
      };
    });

    const newIlinks = ilinks.map(i => {
      for (const ref of refactored) {
        if (ref.from === i.raw_id) {
          return {
            ...i,
            value: ref.to,
            raw_id: ref.to,
          };
        }
      }
      return i;
    });

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
