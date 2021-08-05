import * as React from 'react';
import { RootElement } from './SyncBlock.styles';
import { SyncBlockProps } from './SyncBlock.types';

export const SyncBlock = (props: SyncBlockProps) => {
  const { attributes, children, element, nodeProps } = props;

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        This is a nice block. {JSON.stringify(element)}
      </div>
      {children}
    </RootElement>
  );
};
