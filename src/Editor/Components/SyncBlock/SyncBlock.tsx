import refreshFill from '@iconify-icons/ri/refresh-fill';
import notionIcon from '@iconify/icons-simple-icons/notion';
import slackIcon from '@iconify/icons-simple-icons/slack';
import telegramIcon from '@iconify/icons-simple-icons/telegram';
import Icon from '@iconify/react';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';
import { useSyncStore } from '../../Store/SyncStore';
import {
  ElementHeader,
  FormControls,
  RootElement,
  ServiceLabel,
  ServiceSelectorLabel,
  SyncForm,
} from './SyncBlock.styles';
import { connection_services, SyncBlockProps } from './SyncBlock.types';

type FormValues = {
  content: string;
  connections: {
    [key: string]: boolean;
  };
};

const Icons: {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
} = {
  telegram: telegramIcon,
  slack: slackIcon,
  notion: notionIcon,
};

const getIcon = (s: string) => {
  const icon = Icons[s];
  if (icon) return icon;
  return refreshFill;
};

export const SyncBlock = (props: SyncBlockProps) => {
  const { attributes, children, element } = props;
  const { register, handleSubmit } = useForm<FormValues>();

  const editSyncBlock = useSyncStore(state => state.editSyncBlock);

  const blocksData = useSyncStore(state => state.syncBlocks);

  const blockData = blocksData.filter(d => d.id === element.id)[0];

  const onSubmit = handleSubmit(data => {
    // console.log(JSON.stringify(data));
    const param = new URLSearchParams({
      source: 'mex',
    }).toString();

    editSyncBlock({
      id: element.id,
      content: data.content,
      connections: blockData.connections,
    });

    axios.post(`https://k43k03g5ab.execute-api.us-east-1.amazonaws.com/dev/listen?${param}`, {
      blockId: 'BLOCK_random',
      text: data.content,
    });

    toast('Sync MAx');
  }); // eslint-disable-line no-console
  React.useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  // Use a useEffect for sync
  /**
   * 
   * 
  
 'POST',
        uri: 'https://k43k03g5ab.execute-api.us-east-1.amazonaws.com/dev/listen',
        qs: {
        },
        body: {
        },
   */

  // useEffect(()=> {
  //   axios.
  // })

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        {/* For quick debug {blockData && JSON.stringify(blockData)} */}

        <SyncForm onSubmit={onSubmit}>
          <ElementHeader>
            <Icon icon={refreshFill} height={20} />
            SyncBlock
          </ElementHeader>
          <textarea
            {...register('content')}
            placeholder="Your content here..."
            defaultValue={blockData && blockData.content}
          />

          {blockData && (
            <FormControls>
              <div>
                {connection_services.map(cs => {
                  const checked = blockData && blockData.connections.includes(cs as any); // eslint-disable-line @typescript-eslint/no-explicit-any
                  return (
                    <ServiceSelectorLabel
                      htmlFor={`connections.${cs}`}
                      key={`${blockData.id}_syncBlocks_${cs}`}
                      checked={checked}
                      data-tip={`Sync with ${cs}`}
                      data-place="bottom"
                    >
                      <ServiceLabel>
                        <Icon icon={getIcon(cs)} />
                        {cs}
                      </ServiceLabel>
                      <input type="checkbox" {...register(`connections.${cs}`)} checked={checked} />
                    </ServiceSelectorLabel>
                  );
                })}
              </div>
              <input type="submit" />
            </FormControls>
          )}
        </SyncForm>
      </div>

      {children}
    </RootElement>
  );
};
