import { ComboText } from '../Editor/Store/Types';

export interface NodeContent {
  type: string;
  content: string | undefined;
}

export interface FileData {
  ilinks: ComboText[];
  tags: ComboText[];
  contents: {
    [key: string]: NodeContent;
  };
}
