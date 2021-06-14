import React from 'react';
import { ProvideEditorContext } from './Editor';

export default function Contexts({ children }: { children: React.ReactNode }) {
  return <ProvideEditorContext>{children}</ProvideEditorContext>;
}
