import React from 'react';
import Centered from '../Styled/Layouts';

export type SnippetsProps = {
  title?: string;
};

const Snippets: React.FC<SnippetsProps> = () => {
  return <Centered>Snippets</Centered>;
};

export default Snippets;
