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
import { useSaver } from '../../editor/Components/Saver' // FIXME move useSaver to hooks
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import useArchive from '../../hooks/useArchive'
import useLoad from '../../hooks/useLoad'
import { useContentStore } from '../../store/useContentStore'
import useDataStore from '../../store/useDataStore'
import { NodeProperties } from '../../store/useEditorStore'
import { GenericSearchResult, useSearchStore } from '../../store/useSearchStore'
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
import { convertContentToRawText, convertEntryToRawText } from '../../utils/search/localSearch'

import { useSearch } from '../../hooks/useSearch'

const Nodes = styled.section`
  padding-right: 2rem;
  height: 100%;
  width: 100%;
`

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

const ArchiveHeader = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  /* background-color: ${({ theme }) => theme.colors.background.card}; */
  overflow-x: hidden;
  padding: 1rem;
  font-size: 1.3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* color: ${({ theme }) => theme.colors.primary}; */
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
  const archive = useDataStore((store) => store.archive)
  const addILink = useDataStore((state) => state.addILink)

  const { unArchiveData, removeArchiveData } = useArchive()
  const [delNode, setDelNode] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const { loadNode } = useLoad()
  const { onSave } = useSaver()
  const contents = useContentStore((store) => store.contents)
  const theme = useTheme()
  const searchIndex = useSearchStore((store) => store.searchIndex)
  const { queryIndex } = useSearch()
  const updateDoc = useSearchStore((store) => store.updateDoc)
  const removeDoc = useSearchStore((store) => store.removeDoc)

  // * TODO: Uncomment this !important
  // useEffect(() => {
  //   getArchiveData()
  // }, [])
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
    const res = await searchIndex('archive', newSearchTerm)
    mog('ArchiveSearch', { newSearchTerm, res })
    if (newSearchTerm === '' && res.length === 0) {
      return initialArchive
    }
    return res
  }

  const initialArchive: GenericSearchResult[] = archive.map((n) => getArchiveResult(n.nodeid))
  const onUnarchiveClick = async (node: ILink) => {
    // const present = ilinks.find((link) => link.key === node.key)

    // if (present) {
    //   setShowModal(true)
    // }

    await unArchiveData([node])
    addILink({ ilink: node.path, nodeid: node.nodeid, archived: true })

    const content = getContent(node.nodeid)
    removeDoc('archive', node.nodeid)
    updateDoc('node', convertEntryToRawText(node.nodeid, content.content, node.path))

    const archiveNode: NodeProperties = {
      id: node.path,
      path: node.path,
      title: node.path,
      nodeid: node.nodeid
    }

    loadNode(node.nodeid, { savePrev: false, fetch: false, node: archiveNode })
  }

  const onDeleteClick = async () => {
    const nodesToDelete = archive.filter((i) => {
      const match = i.path.startsWith(delNode.path)
      return match
    })

    await removeArchiveData(nodesToDelete)

    nodesToDelete.forEach((node) => {
      removeDoc('archive', node.nodeid)
    })

    // onSave()

    setShowModal(false)
  }

  const handleCancel = () => {
    setShowModal(false)
    setDelNode(undefined)
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    mog('BaseItem', item)
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const node = archive.find((node) => node.nodeid === item.id)
    const id = `${item.id}_ResultFor_ArchiveSearch`
    const icon = fileList2Line
    if (!item || !node) return null

    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultHeader>
            <ResultTitle>{node.path}</ResultTitle>
            <ActionContainer>
              <StyledIcon
                fontSize={32}
                color={theme.colors.primary}
                onClick={(ev) => {
                  ev.preventDefault()
                  onUnarchiveClick(node)
                }}
                icon={unarchiveLine}
              />
              <StyledIcon
                fontSize={32}
                color="#df7777"
                onClick={(ev) => {
                  ev.preventDefault()
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
    // mog('BaseItem', item)
    if (!item) return null
    const node = archive.find((node) => node.nodeid === item.id)
    if (!node) return null
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const icon = fileList2Line
    // mog('RenderPreview', { item })
    if (item) {
      // const edNode = { ...node, title: node.path, id: node.nodeid }
      return (
        <SplitSearchPreviewWrapper id={`splitArchiveSearchPreview_for_${item.id}`}>
          <Title>
            {node.path}

            <ActionContainer>
              <StyledIcon
                fontSize={32}
                color={theme.colors.primary}
                onClick={(ev) => {
                  ev.preventDefault()
                  onUnarchiveClick(node)
                }}
                icon={unarchiveLine}
              />
              <StyledIcon
                fontSize={32}
                color="#df7777"
                onClick={(ev) => {
                  ev.preventDefault()
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
  // mog('Archive', { archive })

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Archive</Title>
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
