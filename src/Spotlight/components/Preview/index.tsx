/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { StyledBackground } from '../Spotlight/styled';
import Source from '../Source';
import { Scroll } from '../../styles/layout';

const StyledPreview = styled.div`
  ${StyledBackground}
  ${Scroll}

  padding: 1rem;
  flex: 5;
  border-radius: 1rem;
  white-space: pre-wrap;
`;

const Preview: React.FC<any> = ({ preview }) => {
  return (
    <StyledPreview>
      <div dangerouslySetInnerHTML={{ __html: preview.text }} />
      <Source metadata={preview.metadata} />
    </StyledPreview>
  );
};

export default Preview;
