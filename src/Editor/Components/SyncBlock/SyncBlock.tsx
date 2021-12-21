import refreshFill from '@iconify-icons/ri/refresh-fill'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react/headless' // different import path!
import { client } from '@workduck-io/dwindle'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ActionType } from '../../../analytics/events'
import useAnalytics from '../../../analytics'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import useIntents from '../../../Hooks/useIntents/useIntents'
import useToggleElements from '../../../Hooks/useToggleElements/useToggleElements'
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
import { getEventNameFromElement } from '../../../Lib/strings'
import useOnboard from '../../../Components/Onboarding/store'
import { performClick } from '../../../Components/Onboarding/steps'

type FormValues = {
  content: string
  connections: {
    [key: string]: boolean
  }
}

export const SyncBlock = (props: SyncBlockProps) => {
  const { attributes, children, element, info } = props

  const { register, getValues } = useForm<FormValues>()
  const editSyncBlock = useSyncStore((state) => state.editSyncBlock)
  const selectedSyncBlockId = useSyncStore((state) => state.selectedSyncBlock)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const flowMessage = useOnboard((s) => s.flowMessage)

  const setSelected = useSyncStore((state) => state.setSelected)
  const [synced, setSynced] = useState(false)
  const { showSyncBlocks } = useToggleElements()

  const uid = useEditorStore((store) => store.node.uid)
  const parentNodeId = useEditorStore((store) => store.node.uid)
  const blocksData = useSyncStore((state) => state.syncBlocks)

  const { trackEvent } = useAnalytics()
  const [changedIntents, setChangedIntents] = useState<{ [id: string]: Intent }>({})

  const selected = selectedSyncBlockId === element.id

  const { getIntents, getTemplate, updateNodeIntentsAndCreateIGID } = useIntents()

  let blockData: SyncBlockData = {} as SyncBlockData
  const blockDataFiltered = blocksData.filter((d) => d.id === element.id)

  if (showSyncBlocks && !info) {
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

  const { content, templateId, igid } = blockData

  const intents = getIntents(uid, templateId)
  const template = getTemplate(templateId)

  const areAllIntentsPresent = intents?.reduce((prev, cur) => {
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

    trackEvent(getEventNameFromElement('Sync Block', ActionType.SAVE, 'Intent'), {
      'mex-sync-block-id': element.id,
      'mex-content': content,
      'mex-intent-group-id': newIgid,
      'mex-template-id': templateId
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
      content: data?.content,
      igid: igid,
      templateId: templateId
    })

    if (isOnboarding) {
      setSynced(true)

      setTimeout(() => {
        setSynced(false)
      }, 2000)

      performClick()

      return
    }

    trackEvent(getEventNameFromElement('Sync Block', ActionType.SYNC, 'sync_block'), {
      'mex-sync-block-id': element.id,
      'mex-content': data?.content,
      'mex-intent-group-id': igid,
      'mex-template-id': templateId
    })

    client.post(integrationURLs.listen(param), {
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

        <SyncForm
          data-tour={flowMessage ? 'mex-flow-block-response' : 'mex-flow-block'}
          selected={selected || isOnboarding}
          onClick={() => setSelected(element.id)}
        >
          <ElementHeader>
            <Widget>
              <Icon icon={refreshFill} height={20} />
              FlowBlock
              <SyncTitle>{template?.title}</SyncTitle>
            </Widget>
            {!fromLocal && (
              <Widget>
                <Icon icon={getSyncServiceIcon(service)}></Icon>
                Sent from
                <SyncTitle>{service}</SyncTitle>
              </Widget>
            )}
          </ElementHeader>

          {areAllIntentsPresent || isOnboarding ? (
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
                defaultValue={content ?? ''}
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
                  {(areAllIntentsPresent || isOnboarding) && (
                    <Button primary onClick={onSubmit}>
                      {
                        content === '' || isOnboarding ? 'Submit' : 'Edit' // FIXME
                      }
                    </Button>
                  )}

                  {!areAllIntentsPresent && !isOnboarding && (
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
