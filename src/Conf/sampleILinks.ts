const ilinkStrings: string[] = ['github', 'workduck', 'mex', 'dev', 'testing', 'deployment', 'javascript'];

const generateILink = (ilink: string, value: number) => ({
  key: ilink,
  text: ilink,
  value: String(value),
});

const generateILinks = (ilinks: string[]) => ilinks.map(generateILink);

export default generateILinks(ilinkStrings);

export { generateILink, generateILinks };
