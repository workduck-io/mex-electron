import { ComboText } from '../Editor/Store/Types';

const tagStrings: string[] = ['github', 'workduck', 'mex', 'dev', 'testing', 'deployment', 'javascript'];

export const generateComboText = (tag: string, value: number): ComboText => ({
  key: tag,
  text: tag,
  value: String(value),
});

export const generateComboTexts = (items: string[]) => items.map(generateComboText);

export default generateComboTexts(tagStrings);

export { generateComboText as generateTag, generateComboTexts as generateTags };
