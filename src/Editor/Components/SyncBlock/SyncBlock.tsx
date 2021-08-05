import refreshFill from '@iconify-icons/ri/refresh-fill';
import notionIcon from '@iconify/icons-simple-icons/notion';
import slackIcon from '@iconify/icons-simple-icons/slack';
import telegramIcon from '@iconify/icons-simple-icons/telegram';
import Icon from '@iconify/react';
import React from 'react';
import { useForm } from 'react-hook-form';
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
  const onSubmit = handleSubmit(data => console.log(JSON.stringify(data))); // eslint-disable-line no-console

  const blocksData = useSyncStore(state => state.syncBlocks);

  const blockData = blocksData.filter(d => d.id === element.id)[0];

  React.useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  // Use a useEffect for sync

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        {/* For quick debug {blockData && JSON.stringify(blockData)} */}

        <SyncForm onSubmit={onSubmit}>
          <ElementHeader>
            <Icon icon={refreshFill} height={20} />
            SyncBlock
          </ElementHeader>
          <textarea {...register('content')} placeholder="Your content here..." defaultValue={blockData.content} />

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
        </SyncForm>
      </div>

      {children}
    </RootElement>
  );
};
