import React from 'react';
import Centered from '../Styled/Layouts';

export type SnippetsProps = {
  title?: string;
};

const Snippets: React.FC<SnippetsProps> = () => {
  return (
    <Centered>
      <div>
        <a target="_blank" rel="noreferrer" href="https://www.xypnox.com/">
          xypnox
        </a>
      </div>
      Snippets
    </Centered>
  );
};

export default Snippets;
