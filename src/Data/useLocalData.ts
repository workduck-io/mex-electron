import { ipcRenderer } from 'electron';

export const useLocalData = async () => {
  const prom = new Promise(resolve => {
    ipcRenderer.on('recieve-local-data', (_event, arg) => {
      resolve(arg);
    });
  });

  ipcRenderer.send('get-local-data');
  return prom;
};
