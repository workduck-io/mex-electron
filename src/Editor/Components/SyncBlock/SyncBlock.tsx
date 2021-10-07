import refreshFill from '@iconify-icons/ri/refresh-fill'
import { Icon } from '@iconify/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactTooltip from 'react-tooltip'
import { useSelected } from 'slate-react'
import { WORKSPACE_ID } from '../../../Defaults/auth'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useIntents from '../../../Hooks/useIntents/useIntents'
import { isIntent } from '../../../Lib/intents'
import { apiURLs } from '../../../Requests/routes'
import { Button } from '../../../Styled/Buttons'
import { SyncIntentsWrapper } from '../../../Styled/Integrations'
import { useSyncStore } from '../../Store/SyncStore'
import IntentSelector from './intentSelector'
import { ElementHeader, FormControls, RootElement, SyncForm, SyncTitle } from './SyncBlock.styles'
import { Intent, SyncBlockData, SyncBlockProps } from './SyncBlock.types'

type FormValues = {
  content: string
  connections: {
    [key: string]: boolean
  }
}

export const SyncBlock = (props: SyncBlockProps) => {
  const { attributes, children, element } = props
  const { register, getValues } = useForm<FormValues>()
  const editSyncBlock = useSyncStore((state) => state.editSyncBlock)

  const uid = useEditorStore((store) => store.node.uid)
  const parentNodeId = useEditorStore((store) => store.node.key)
  const blocksData = useSyncStore((state) => state.syncBlocks)
  const blockDataFiltered = blocksData.filter((d) => d.id === element.id)

  const [changedIntents, setChangedIntents] = useState<{ [id: string]: Intent }>({})

  const selected = useSelected()

  React.useEffect(() => {
    ReactTooltip.rebuild()
  }, [selected])

  const { getIntents, getTemplate, updateNodeIntentsAndCreateIGID } = useIntents()

  if (blockDataFiltered.length === 0) return new Error('BlockData undefined')

  const blockData = blockDataFiltered[0] as SyncBlockData

  const intents = getIntents(uid, blockData.templateId)
  const template = getTemplate(blockData.templateId)

  const areAllIntentsPresent = intents.reduce((prev, cur) => {
    if (cur) return prev && isIntent(cur)
    else return false
  }, true)

  // console.log('SyncBlock', { areAllIntentsPresent, blockData, template, intents, changedIntents })

  // const syncTitle = getSyncBlockTitle(blockData.title)
  const onSelectIntent = (intent: Intent) => {
    const newState = { ...changedIntents, [intent.service]: intent }
    // console.log('NewState', newState)
    setChangedIntents(newState)
  }

  const onIntentsSave = (e) => {
    e.preventDefault()
    // console.log('Saving Intents', { changedIntents })

    const newIgid = updateNodeIntentsAndCreateIGID(
      uid,
      Object.keys(changedIntents).map((s) => {
        return changedIntents[s]
      }),
      template.id
    )

    editSyncBlock({
      id: element.id,
      content: blockData.content,
      igid: newIgid,
      templateId: blockData.templateId
    })

    // toast('Intents updated successfully')

    setChangedIntents({})
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const data = getValues()
    const param = new URLSearchParams({
      source: 'mex'
    }).toString()

    editSyncBlock({
      id: element.id,
      content: data.content,
      igid: blockData.igid,
      templateId: blockData.templateId
    })

    // Inserted only on send
    const InsertParams =
      blockData.content === ''
        ? {
            igId: blockData.igid,
            templateId: blockData.templateId,
            workspaceId: WORKSPACE_ID
          }
        : {}

    axios.post(apiURLs.listen(param), {
      parentNodeId: parentNodeId ?? 'BLOCK_random',
      syncId: element.id,
      text: data.content,
      intentGroupId: blockData.igid,
      // On insert
      // ...InsertParams,
      eventType: blockData.content === '' ? 'INSERT' : 'EDIT' // FIXME
    })
    toast('Sync Successful')
  } // eslint-disable-line no-console

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        {/* For quick debug {blockData && JSON.stringify(blockData)} */}

        <SyncForm selected={selected}>
          <ElementHeader>
            <Icon icon={refreshFill} height={20} />
            SyncBlock
            <SyncTitle>{template.title}</SyncTitle>
          </ElementHeader>

          {areAllIntentsPresent ? (
            <textarea
              {...register('content')}
              placeholder="Your content here..."
              className="syncTextArea"
              defaultValue={blockData && blockData.content}
              autoFocus={true}
            />
          ) : (
            <p>Please set the specific intents.</p>
          )}

          {(!areAllIntentsPresent || selected) && (
            <FormControls float={areAllIntentsPresent}>
              <SyncIntentsWrapper>
                {intents &&
                  intents.map((intent) => {
                    if (isIntent(intent)) {
                      return (
                        <IntentSelector
                          id={`SyncBlocksIntentSelector${blockData.id}`}
                          key={`SyncBlocksIntentSelector${blockData.id}${intent.service}`}
                          // showPosition={{ x: 0, y: 64 }}
                          service={intent.service}
                          type={intent.type}
                          defaultIntent={intent}
                          readOnly={true}
                          onSelect={(val) => console.log({ val })}
                        />
                      )
                    } else {
                      return (
                        <IntentSelector
                          id={`SyncBlocksIntentPreview${blockData.id}`}
                          key={`SyncBlocksIntentPreview${blockData.id}${intent.service}`}
                          // showPosition={{ x: 0, y: 64 }}
                          service={intent.service}
                          type={intent.type}
                          readOnly={false}
                          onSelect={onSelectIntent}
                        />
                      )
                    }
                  })}
              </SyncIntentsWrapper>

              {areAllIntentsPresent && (
                <Button primary onClick={onSubmit}>
                  {
                    blockData.content === '' ? 'Submit' : 'Edit' // FIXME
                  }
                </Button>
              )}

              {!areAllIntentsPresent && (
                <Button primary onClick={onIntentsSave}>
                  Save Intents
                </Button>
              )}
            </FormControls>
          )}
        </SyncForm>
      </div>

      {children}
    </RootElement>
  )
}
