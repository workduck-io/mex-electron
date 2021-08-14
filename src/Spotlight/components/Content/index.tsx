import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DEFAULT_PREVIEW_TEXT } from '../../utils/constants';
import { useSpotlightContext } from '../../utils/context';
import { results } from '../../utils/data';
import { useCurrentIndex } from '../../utils/hooks';
import Preview from '../Preview';
import SideBar from '../SideBar';

const StyledContent = styled.section`
  display: flex;
  flex: 1;
  max-height: 290px;
  margin: 0.5rem 0;
`;

const initPreview = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
};

const Content = () => {
  const { search, selection } = useSpotlightContext();

  const [data, setData] = useState<Array<any>>();
  const [preview, setPreview] = useState<any>(initPreview);
  const currentIndex = useCurrentIndex(data, search);

  useEffect(() => {
    setData(search ? results : undefined);
  }, [search]);

  useEffect(() => {
    const prevTemplate = {
      text: DEFAULT_PREVIEW_TEXT,
      metadata: null,
    };

    if (!data) {
      if (selection) setPreview(selection);
      else setPreview(prevTemplate);
    } else if (data.length === 0) {
      setPreview({
        ...prevTemplate,
        text: 'No result found!',
      });
    } else {
      setPreview({
        ...prevTemplate,
        text: data[currentIndex].desc,
      });
    }
  }, [data, currentIndex, selection]);

  return (
    <StyledContent>
      <Preview preview={preview} />
      <SideBar index={currentIndex} data={data} />
    </StyledContent>
  );
};

export default Content;
