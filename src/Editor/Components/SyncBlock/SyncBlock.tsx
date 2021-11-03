import refreshFill from '@iconify-icons/ri/refresh-fill'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react/headless' // different import path!
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactTooltip from 'react-tooltip'
import { useSelected } from 'slate-react'
import useToggleElements from '../../../Hooks/useToggleElements/useToggleElements'
import { WORKSPACE_ID } from '../../../Defaults/auth'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useIntents from '../../../Hooks/useIntents/useIntents'
import { isIntent } from '../../../Lib/intents'
import { integrationURLs } from '../../../Requests/routes'
import { Button } from '../../../Styled/Buttons'
import { SyncIntentsWrapper } from '../../../Styled/Integration'
import { TooltipBase } from '../../../Styled/tippy'
import { useSyncStore } from '../../Store/SyncStore'
import IntentSelector from './intentSelector'
import { ElementHeader, FormControls, RootElement, SentFrom, SyncForm, SyncTitle, Widget } from './SyncBlock.styles'
import { Intent, SyncBlockData, SyncBlockProps } from './SyncBlock.types'
import { getSyncServiceIcon } from './SyncIcons'

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
  const [synced, setSynced] = useState(false)
  const { showSyncBlocks } = useToggleElements()

  const uid = useEditorStore((store) => store.node.uid)
  const parentNodeId = useEditorStore((store) => store.node.key)
  const blocksData = useSyncStore((state) => state.syncBlocks)

  const [changedIntents, setChangedIntents] = useState<{ [id: string]: Intent }>({})

  const selected = useSelected()

  React.useEffect(() => {
    ReactTooltip.rebuild()
  }, [selected])

  const { getIntents, getTemplate, updateNodeIntentsAndCreateIGID } = useIntents()

  let blockData: SyncBlockData
  const blockDataFiltered = blocksData.filter((d) => d.id === element.id)

  if (showSyncBlocks) {
    return <div>{children}</div>
  }

  // Editable means whether this
  let fromLocal = true
  let service

  if (blockDataFiltered.length > 0) {
    blockData = blockDataFiltered[0] as SyncBlockData
  } else {
    if (element.properties) {
      blockData = { id: element.id, ...element.properties }
      fromLocal = false
      service = element.properties.service
    }
    // else {
    //   return new Error('Sync Block data not present in local store and in content as well')
    // }
  }

  return <RootElement {...attributes}>Sync Block{children}</RootElement>

  const { content, templateId, igid } = blockData

  const intents = getIntents(uid, templateId)
  const template = getTemplate(templateId)

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
      content: content,
      igid: newIgid,
      templateId: templateId
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
      igid: igid,
      templateId: templateId
    })

    // Inserted only on send
    const InsertParams =
      content === ''
        ? {
            igId: igid,
            templateId: templateId,
            workspaceId: WORKSPACE_ID
          }
        : {}

    axios.post(integrationURLs.listen(param), {
      parentNodeId: parentNodeId ?? 'BLOCK_random',
      syncId: element.id,
      text: data.content,
      intentGroupId: igid,
      // On insert
      // ...InsertParams,
      eventType: content === '' ? 'INSERT' : 'EDIT' // FIXME
    })
    setSynced(true)
    setTimeout(() => {
      setSynced(false)
    }, 2000)
  } // eslint-disable-line no-console

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        {/* For quick debug {& JSON.stringify(blockData)} */}

        <SyncForm selected={selected}>
          <ElementHeader>
            <Widget>
              <Icon icon={refreshFill} height={20} />
              SyncBlock
              <SyncTitle>{template.title}</SyncTitle>
            </Widget>
            {!fromLocal && (
              <Widget>
                <Icon icon={getSyncServiceIcon(service)}></Icon>
                Sent from
                <SyncTitle>{service}</SyncTitle>
              </Widget>
            )}
          </ElementHeader>

          {areAllIntentsPresent ? (
            <Tippy
              placement="top-end"
              appendTo={() => document.body}
              visible={synced}
              render={(attrs) => (
                <TooltipBase className="__haha" tabIndex={-1} {...attrs}>
                  Synced Successful
                </TooltipBase>
              )}
            >
              <textarea
                {...register('content')}
                placeholder="Your content here..."
                className="syncTextArea"
                defaultValue={content}
                readOnly={!fromLocal}
                autoFocus={true}
              />
            </Tippy>
          ) : (
            <p>Please set the specific intents.</p>
          )}

          {(!areAllIntentsPresent || selected) && (
            <FormControls float={areAllIntentsPresent}>
              <SyncIntentsWrapper>
                {intents &&
                  intents.map((intent) => {
                    if (intent.service !== 'MEX') {
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
                    } else return null
                  })}
              </SyncIntentsWrapper>

              {fromLocal ? (
                <>
                  {areAllIntentsPresent && (
                    <Button primary onClick={onSubmit}>
                      {
                        content === '' ? 'Submit' : 'Edit' // FIXME
                      }
                    </Button>
                  )}

                  {!areAllIntentsPresent && (
                    <Button primary onClick={onIntentsSave}>
                      Save Intents
                    </Button>
                  )}
                </>
              ) : (
                <SentFrom>
                  Sent from {service}
                  <Icon icon={getSyncServiceIcon(service)}></Icon>
                </SentFrom>
              )}
            </FormControls>
          )}
        </SyncForm>
      </div>

      {children}
    </RootElement>
  )
}
