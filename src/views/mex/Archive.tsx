import unarchiveLine from '@iconify/icons-clarity/unarchive-line'
import trashIcon from '@iconify/icons-codicon/trash'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Modal from 'react-modal'
import styled, { useTheme } from 'styled-components'
import { ModalControls, ModalHeader, MRMHead } from '../../components/mex/Refactor/styles'
import SearchView, { RenderItemProps, RenderPreviewProps } from '../../components/mex/Search/SearchView'
import { View } from '../../components/mex/Search/ViewSelector'
import { defaultContent } from '../../data/Defaults/baseData'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import useArchive from '../../hooks/useArchive'
import useLoad from '../../hooks/useLoad'
import { useContentStore } from '../../store/useContentStore'
import useDataStore from '../../store/useDataStore'
import { NodeProperties } from '../../store/useEditorStore'
import { Button } from '../../style/Buttons'
import { MainHeader } from '../../style/Layouts'
import {
  Result,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper
} from '../../style/Search'
import { Title } from '../../style/Typography'
import { ILink } from '../../types/Types'
import { getContent } from '../../utils/helpers'
import { mog } from '../../utils/lib/helper'
import { convertContentToRawText } from '../../utils/search/parseData'

import { useSearch } from '../../hooks/useSearch'
import { GenericSearchResult } from '../../types/search'
import Infobox from '../../ui/components/Help/Infobox'
import { ArchiveHelp } from '../../data/Defaults/helpText'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useDelete } from '@hooks/useDelete'
import toast from 'react-hot-toast'

export const ArchivedNode = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 16rem;
  height: 8rem;
  margin: 1rem;
  background-color: ${({ theme }) => theme.colors.background.card};
`

const StyledIcon = styled(Icon)`
  cursor: pointer;
  padding: 0.4rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  :hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const Archive = () => {
  const [delNode, setDelNode] = useState(undefined)
  const [showModal, setShowModal] = useState(false)

  const archive = useDataStore((store) => store.archive)
  const contents = useContentStore((store) => store.contents)

  const { goTo } = useRouting()
  const { loadNode } = useLoad()
  const { queryIndex } = useSearch()
  const { getMockDelete } = useDelete()
  const { createNewNote } = useCreateNewNote()
  const { updateDocument, removeDocument } = useSearch()
  const { unArchiveData, removeArchiveData } = useArchive()

  const getArchiveResult = (nodeid: string): GenericSearchResult => {
    const node = archive.find((node) => node.nodeid === nodeid)
    const content = getContent(nodeid)

    return {
      id: nodeid,
      title: node.path,
      text: convertContentToRawText(content.content)
    }
  }

  const onSearch = async (newSearchTerm: string) => {
    const res = await queryIndex('archive', newSearchTerm)
    mog('ArchiveSearch', { newSearchTerm, res })
    if (newSearchTerm === '' && res.length === 0) {
      return initialArchive
    }
    return res
  }

  const initialArchive: GenericSearchResult[] = archive.map((n) => getArchiveResult(n.nodeid))

  const onUnarchiveClick = async (node: ILink) => {
    await unArchiveData([node])
    createNewNote({ path: node.path, noteId: node.nodeid })

    const content = getContent(node.nodeid)
    await removeDocument('archive', node.nodeid)

    await updateDocument('node', node.nodeid, content.content, node.path)

    const archiveNode: NodeProperties = {
      id: node.path,
      path: node.path,
      title: node.path,
      nodeid: node.nodeid
    }

    loadNode(node.nodeid, { savePrev: false, fetch: false, node: archiveNode })
  }

  const onDeleteClick = async () => {
    const notesToDelete = getMockDelete(delNode.id)

    try {
      await removeArchiveData(notesToDelete)
    } catch (err) {
      toast('Error deleting Note')
    }

    notesToDelete.forEach(async (node) => {
      await removeDocument('archive', node.nodeid)
    })

    // onSave()

    setShowModal(false)
  }

  const handleCancel = () => {
    setShowModal(false)
    setDelNode(undefined)
  }

  const handleArchiveCardClick = (nodeid: string) => {
    goTo(ROUTE_PATHS.archive, NavigationType.push, nodeid)
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    // mog('BaseItem', item)
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const node = archive.find((node) => node.nodeid === item.id)
    const id = `${item.id}_ResultFor_ArchiveSearch`
    const icon = fileList2Line
    if (!item || !node) return null

    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref} onClick={() => handleArchiveCardClick(item.id)}>
          <ResultHeader>
            <ResultTitle>{node.path}</ResultTitle>
            <ActionContainer>
              {/* <StyledIcon
                fontSize={32}
                color={theme.colors.primary}
                onClick={(ev) => {
                  ev.preventDefault()
                  onUnarchiveClick(node)
                }}
                icon={unarchiveLine}
              /> */}
              <StyledIcon
                fontSize={32}
                color="#df7777"
                onClick={(ev) => {
                  ev.preventDefault()
                  ev.stopPropagation()
                  setDelNode(item)
                  setShowModal(true)
                }}
                icon={trashIcon}
              />
            </ActionContainer>
          </ResultHeader>
          <SearchPreviewWrapper>
            <EditorPreviewRenderer content={content} editorId={`editor_archive_preview_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain>
              <ResultTitle>{node.path}</ResultTitle>
              <ResultDesc>{convertContentToRawText(content, ' ')}</ResultDesc>
            </ResultMain>
          </ResultRow>
        </Result>
      )
    }

    return null
  }
  const RenderItem = React.forwardRef(BaseItem)

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    if (!item) return null
    const node = archive.find((node) => node.nodeid === item.id)
    if (!node) return null
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    if (item) {
      return (
        <SplitSearchPreviewWrapper id={`splitArchiveSearchPreview_for_${item.id}`}>
          <Title>
            {node.path}

            <ActionContainer>
              <StyledIcon
                fontSize={32}
                color="#df7777"
                onClick={(ev) => {
                  ev.preventDefault()
                  ev.stopPropagation()

                  setDelNode(item)
                  setShowModal(true)
                }}
                icon={trashIcon}
              />
            </ActionContainer>
          </Title>
          <EditorPreviewRenderer content={content} editorId={`SnippetSearchPreview_editor_${item.id}`} />
        </SplitSearchPreviewWrapper>
      )
    } else
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
        </SplitSearchPreviewWrapper>
      )
  }

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Archive</Title>
        <Infobox text={ArchiveHelp} />
      </MainHeader>

      <SearchView
        id="ArchiveSearch"
        key="ArchiveSearch"
        initialItems={initialArchive}
        onSearch={onSearch}
        getItemKey={(item) => `archive_${item.id}`}
        onSelect={(node) => {
          mog('onSelect: NodeSelected', { node })
        }}
        options={{ view: View.Card }}
        onEscapeExit={() => {
          setShowModal(false)
          setDelNode(undefined)
        }}
        RenderItem={React.forwardRef(BaseItem)}
        RenderPreview={RenderPreview}
      />
      <Modal
        className="ModalContent"
        overlayClassName="ModalOverlay"
        onRequestClose={() => setShowModal(false)}
        isOpen={showModal}
      >
        <ModalHeader>Archive</ModalHeader>
        <MRMHead>
          {!delNode && <h1>Node with same name is present in the workspace.</h1>}
          <p>Are you sure you want to {delNode ? 'delete' : 'replace'}?</p>
        </MRMHead>
        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <Button large primary onClick={onDeleteClick}>
            {delNode ? 'Delete' : 'Replace'}
          </Button>
        </ModalControls>
      </Modal>
    </SearchContainer>
  )
}

export default Archive
