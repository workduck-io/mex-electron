const tagStrings: string[] = [
  'github',
  'workduck',
  'mex',
  'dev',
  'testing',
  'deployment',
  'javascript',
];

const generateTag = (tag: string, value: number) => ({
  key: tag,
  text: tag,
  value: String(value),
});

const generateTags = (tags: string[]) => tags.map(generateTag);

export default generateTags(tagStrings);

export { generateTag, generateTags };
