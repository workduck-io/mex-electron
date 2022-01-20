/* eslint-disable import/prefer-default-export */
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { getContent, isFromSameSource } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { useDataSaverFromContent, useSaver } from '../../Editor/Components/Saver'
import { IpcAction } from './IpcAction'
import { useSpotlightContext } from './context'
import { useSpotlightEditorStore } from '../store/editor'
import useLoad from '../../Hooks/useLoad/useLoad'
import { useSpotlightAppStore } from '../store/app'
import { createNodeWithUid } from '../../Lib/helper'
import { getNewDraftKey } from '../../Editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '../../Editor/Store/useDataStore'
import { AppType } from '../../Data/useInitialize'
import { appNotifierWindow } from './notifiers'
import { useSaveData } from '../../Data/useSaveData'
import { defaultContent } from '../../Defaults/baseData'

export const combineSources = (
  oldSourceContent: NodeEditorContent,
  newSourceContent: NodeEditorContent
): NodeEditorContent => {
  let isParagraphSource = false

  const oldSourceIndex = oldSourceContent.length - 1
  const oldSourceChildrenIndex = oldSourceContent[oldSourceIndex].children.length - 1

  const newSourceIndex = 0
  const newSourceChildrenIndex = newSourceContent[newSourceIndex].children.length - 1

  let oldSource = oldSourceContent[oldSourceIndex].children[oldSourceChildrenIndex]
  let newSource = newSourceContent[newSourceIndex].children[newSourceChildrenIndex]

  if (oldSource.type === 'p') {
    oldSource = oldSource.children[oldSource.children.length - 1]
    isParagraphSource = true
  }

  if (newSource.type === 'p') {
    newSource = newSource.children[newSource.children.length - 1]
  }

  const areSameSource = isFromSameSource(oldSource, newSource)

  const removedContent = areSameSource
    ? oldSourceContent.map((content, index) => {
        if (index === oldSourceIndex) {
          const sliceToIndex = isParagraphSource ? oldSourceChildrenIndex : oldSourceChildrenIndex - 2
          return {
            children: content.children.slice(0, sliceToIndex)
          }
        }
        return content
      })
    : oldSourceContent

  return removedContent
}

export const openNodeInMex = (nodeId: string) => {
  // * Open saved node in Mex
  ipcRenderer.send(IpcAction.OPEN_NODE_IN_MEX, { nodeId: nodeId })
}
