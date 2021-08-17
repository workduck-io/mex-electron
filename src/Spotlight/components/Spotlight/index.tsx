import React from 'react';
import Search from '../Search';
import Content from '../Content';
import Shortcuts from '../Shortcuts';
import { StyledLookup } from './styled';
import { useLocalShortcuts } from '../../utils/context';

const Spotlight = () => {
  useLocalShortcuts();

  return (
    <StyledLookup>
      <Search />
      <Content />
      <Shortcuts />
    </StyledLookup>
  );
};

export default Spotlight;
