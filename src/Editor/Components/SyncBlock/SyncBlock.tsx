import { useSelected } from 'slate-react'
import refreshFill from '@iconify-icons/ri/refresh-fill'
import { Icon } from '@iconify/react'
import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactTooltip from 'react-tooltip'
import { useSyncStore } from '../../Store/SyncStore'
import {
  ElementHeader,
  FormControls,
  RootElement,
  ServiceLabel,
  ServiceSelectorLabel,
  SyncForm,
  SyncTitle
} from './SyncBlock.styles'
import { SyncBlockData, SyncBlockProps } from './SyncBlock.types'
import { getSyncServiceIcon } from './SyncIcons'
import useIntents from '../../../Hooks/useIntents/useIntents'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { Button } from '../../../Styled/Buttons'
import IntentSelector from './intentSelector'

type FormValues = {
  content: string
  connections: {
    [key: string]: boolean
  }
}

export const SyncBlock = (props: SyncBlockProps) => {
  const { attributes, children, element } = props
  const { register, handleSubmit } = useForm<FormValues>()
  const editSyncBlock = useSyncStore((state) => state.editSyncBlock)

  const nodeUniqueId = useEditorStore((store) => store.node.id)
  const parentNodeId = useEditorStore((store) => store.node.key)
  const blocksData = useSyncStore((state) => state.syncBlocks)
  const blockDataFiltered = blocksData.filter((d) => d.id === element.id)

  const selected = useSelected()

  React.useEffect(() => {
    ReactTooltip.rebuild()
  }, [selected])

  const { getIntents, getTemplate } = useIntents()

  if (blockDataFiltered.length === 0) return null

  const blockData = blockDataFiltered[0] as SyncBlockData

  const intents = getIntents(nodeUniqueId, blockData.igid)
  const template = getTemplate(nodeUniqueId, blockData.igid)

  console.log('SyncBlock', { blockData, template, intents })

  // const syncTitle = getSyncBlockTitle(blockData.title)

  const onSubmit = handleSubmit((data) => {
    // console.log(JSON.stringify(data));
    const param = new URLSearchParams({
      source: 'mex'
    }).toString()

    editSyncBlock({
      id: element.id,
      content: data.content,
      igid: blockData.igid
    })

    // Inserted only on send
    const InsertParams =
      blockData.content === ''
        ? {
            igId: null,
            templateId: null,
            workspaceId: null
          }
        : {}

    axios.post(`https://api.workduck.io/integration/listen?${param}`, {
      parentNodeId: parentNodeId ?? 'BLOCK_random',
      blockId: element.id,
      text: data.content,
      // On insert
      ...InsertParams,
      eventType: blockData.content === '' ? 'INSERT' : 'EDIT' // FIXME
    })

    toast('Sync Successful')
  }) // eslint-disable-line no-console

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        {/* For quick debug {blockData && JSON.stringify(blockData)} */}

        <SyncForm onSubmit={onSubmit} selected={selected}>
          <ElementHeader>
            <Icon icon={refreshFill} height={20} />
            SyncBlock
            <SyncTitle>{template.title}</SyncTitle>
          </ElementHeader>
          <textarea
            {...register('content')}
            placeholder="Your content here..."
            className="syncTextArea"
            defaultValue={blockData && blockData.content}
          />

          {blockData && selected && (
            <FormControls>
              <IntentSelector
                id="SyncBlockIntentSelector"
                showPosition={{ x: 0, y: 64 }}
                service="github"
                type="repo"
                readOnly={true}
                onSelect={(val) => console.log({ val })}
              />
              <div>
                {intents &&
                  intents.map((intent) => {
                    if (intent === undefined) return <p>Hello</p>
                    else {
                      return (
                        <ServiceSelectorLabel
                          htmlFor={`connections.${intent.value}`}
                          key={`${blockData.id}_syncBlocks_${intent.value}`}
                          data-tip={`Sync with ${intent.service}`}
                          data-place="bottom"
                        >
                          <ServiceLabel>
                            <Icon icon={getSyncServiceIcon(intent.service)} />
                            {intent.type} - {intent.value}
                          </ServiceLabel>
                          <input type="checkbox" {...register(`connections.${intent}`)} />
                        </ServiceSelectorLabel>
                      )
                    }
                  })}
              </div>
              <Button primary type="submit">
                {
                  blockData.content === '' ? 'Submit' : 'Edit' // FIXME
                }
              </Button>
            </FormControls>
          )}
        </SyncForm>
      </div>

      {children}
    </RootElement>
  )
}
