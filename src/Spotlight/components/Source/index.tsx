/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

const AppSource = styled.div`
  margin: 8px 0;
  font-size: 14px;
  padding: 8px;
  border-radius: 5px;
  border: 2px dashed ${({ theme }) => theme.colors.text.primary};
`;

const UrlSource = styled.div`
  margin: 8px 0;
  font-size: 14px;
  padding: 8px;
  border-radius: 5px;
  border: 2px dashed ${({ theme }) => theme.colors.text.primary};
  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AppName = styled.div`
  font-weight: bold;
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SourceTitle = styled.div`
  font-weight: bold;
`;

const Source: React.FC<any> = ({ metadata }) => {
  if (!metadata) {
    return null;
  }

  if (metadata?.url) {
    return (
      <UrlSource>
        Source:{' '}
        <a href={metadata.url} target="_blank" rel="noopener noreferrer">
          {metadata?.title}
        </a>
        {/* <AppName>{metadata?.owner?.name}</AppName> */}
      </UrlSource>
    );
  }

  return (
    <AppSource>
      <SourceTitle>{metadata?.title}</SourceTitle>
      <AppName>{metadata?.owner?.name}</AppName>
    </AppSource>
  );
};

export default Source;
