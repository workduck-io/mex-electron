/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

export const useCurrentIndex = (
  data: Array<any> | undefined,
  search: string
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dataLength = data ? data.length : 2;

  useEffect(() => {
    document.addEventListener('keydown', (ev: any) => {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault();

        setCurrentIndex(prev => (prev + 1) % dataLength);
      }

      if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        setCurrentIndex(prev => {
          const newValue = (prev - 1) % dataLength;
          return newValue < 0 ? newValue + dataLength : newValue;
        });
      }
    });
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [search]);

  return currentIndex;
};
