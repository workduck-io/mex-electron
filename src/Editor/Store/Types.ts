export interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string;
  text: string;
  value: string;
}

export interface DataStoreState {
  tags: ComboText[];
  ilinks: ComboText[];
  slash_commands: ComboText[];

  initializeDataStore: (tags: ComboText[], ids: ComboText[], slash_commands: ComboText[]) => void;

  addTag: (tag: string) => void;
  addILink: (ilink: string) => void;
}
