/* eslint-disable react/prop-types */
import React from 'react';
import { FixedSizeList } from 'react-window';
import { StyledRow, StyledResults, Heading, Description } from './styled';

export const Result: React.FC<{
  result: any;
  selected?: boolean;
  key?: string;
}> = ({ result, selected, key }) => {
  return (
    <StyledRow color={selected} key={key}>
      {result?.title}
      <Description>{result?.author?.name}</Description>
    </StyledRow>
  );
};

const SearchResults: React.FC<{ current: number; data: Array<any> }> = ({
  current,
  data,
}) => {
  return (
    <StyledResults>
      <Heading>Search Results</Heading>
      <FixedSizeList
        height={400}
        itemCount={data.length}
        itemSize={35}
        width={300}
      >
        {({ index }) => {
          const result = data[index];
          return (
            <Result
              selected={index === current}
              key={result?.title}
              result={result}
            />
          );
        }}
      </FixedSizeList>
    </StyledResults>
  );
};

export default SearchResults;
