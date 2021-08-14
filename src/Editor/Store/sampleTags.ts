import { ComboText } from './Types';

export const generateComboText = (tag: string, value: number): ComboText => ({
  key: tag,
  raw_id: tag,
  value: String(value),
});

export const generateComboTexts = (items: string[]) => items.map(generateComboText);
