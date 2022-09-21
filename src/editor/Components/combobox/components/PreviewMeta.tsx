import NamespaceTag from '@components/mex/NamespaceTag'
import { useNamespaces } from '@hooks/useNamespaces'
import { mog } from '@workduck-io/mex-utils'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Data } from '../../../../components/mex/Metadata/Metadata'
import { RelativeTime } from '../../../../components/mex/RelativeTime'

type PreviewMetaProps = {
  meta: any
  namespace: string
}

const PreviewMetaContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[8]};
  align-items: center;
  justify-content: space-between;

  ${Data} {
    font-size: 0.8em;
    color: ${({ theme }) => theme.colors.gray[6]};
  }
`

const PreviewMeta: React.FC<PreviewMetaProps> = ({ meta, namespace }) => {
  const { getNamespace } = useNamespaces()
  const currentNoteNamespace = useMemo(() => getNamespace(namespace), [namespace])

  mog('NAMESPACE', { namespace })

  if (!meta) return <></>

  return (
    <PreviewMetaContainer>
      <NamespaceTag namespace={currentNoteNamespace} />
      {meta.updatedAt !== undefined && (
        <Data>
          <RelativeTime dateNum={meta.updatedAt} />
        </Data>
      )}
    </PreviewMetaContainer>
  )
}

export default PreviewMeta
