/* eslint-disable react/prop-types */
import React from 'react';
import { FixedSizeList } from 'react-window';
import { StyledRow, StyledResults, Heading, Description } from './styled';

export const Result: React.FC<{
  result: any;
  selected?: boolean;
  key?: string;
}> = ({ result, selected }) => {
  return (
    <StyledRow showColor={selected} key={`STRING_${result.key}`}>
      {result?.text}
      <Description>{result?.desc}</Description>
    </StyledRow>
  );
};

const SearchResults: React.FC<{ current: number; data: Array<any> }> = ({ current, data }) => {
  return (
    <StyledResults>
      <Heading>Search Results</Heading>
      <FixedSizeList height={400} itemCount={data.length} itemSize={35} width={300}>
        {({ index }) => {
          const result = data[index];
          return <Result selected={index === current} result={result} />;
        }}
      </FixedSizeList>
    </StyledResults>
  );
};

export default SearchResults;
