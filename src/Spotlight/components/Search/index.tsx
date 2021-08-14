/* eslint-disable react/prop-types */
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import SearchIcon from '@iconify-icons/ph/magnifying-glass-bold';
import Icon from '@iconify/react';
import { useSpotlightContext } from '../../utils/context';
import { StyledSearch, StyledInput } from './styled';
import { CenterIcon } from '../../styles/layout';
import WDLogo from './Logo';

const Search: React.FC = () => {
  const { setSearch } = useSpotlightContext();

  const handleSearchInput = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 400);

  return (
    <StyledSearch>
      <CenterIcon>
        <Icon height={24} width={24} icon={SearchIcon} />
      </CenterIcon>
      <StyledInput
        autoFocus
        placeholder="Search anything.."
        onChange={({ target: { value } }) => handleSearchInput(value)}
      />
      <CenterIcon>
        <WDLogo />
      </CenterIcon>
    </StyledSearch>
  );
};

export default Search;
