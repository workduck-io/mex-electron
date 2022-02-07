import React from 'react'
import toast from 'react-hot-toast'
import { ipcRenderer } from 'electron'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'
import { Wrapper } from '../../../style/Layouts'
import { Title } from '../../../style/Typography'
import { Button } from '../../../style/Buttons'
import { IpcAction } from '../../../data/IpcAction'
import { CardShadow } from '../../../style/helpers'

const ComingSoonImporters = [
  { name: 'Docs', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg' },
  { name: 'Keep', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Google_Keep_icon_%282020%29.svg' },
  { name: 'Evernote', icon: 'https://i.imgur.com/wDoDHyT.png' }
]

const ServiceImgIcon = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: contain;
`

export const CardStyles = css`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
`

export const ComingSoonCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${CardStyles}
  ${CardShadow}

  padding-top: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};

  h1 {
    font-weight: 400;
    font-size: 1.5rem;
    margin-top: ${({ theme }) => theme.spacing.small};
  }
`

export const ImporterCard = styled.div`
  ${CardStyles}
  ${CardShadow}

  display: flex;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.medium};

  ${ServiceImgIcon} {
    padding: ${({ theme }) => theme.spacing.medium};
    height: 256px;
    width: 256px;
  }

  h1 {
    font-weight: 400;
    font-size: 2rem;
    margin-top: ${({ theme }) => theme.spacing.small};
  }
`

const ComingSoonWrapper = styled.div`
  line-height: 1.5;
  margin: ${({ theme }) => theme.spacing.large} 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.large};
`

const ImportersWrapper = styled.div`
  line-height: 1.5;
`

interface ComingSoonImporterProps {
  name: string
  icon: string
}

const ComingSoonImporter = ({ name, icon }: ComingSoonImporterProps) => (
  <ComingSoonCard>
    <ServiceImgIcon src={icon} />
    <h1>{name}</h1>
    <Button disabled>Coming Soon</Button>
  </ComingSoonCard>
)

const Importers = () => {
  const importAppleNotes = () => {
    toast('Importing Apple Notes! This might take a while', { duration: 3000 })
    ipcRenderer.send(IpcAction.IMPORT_APPLE_NOTES)
  }
  return (
    <Wrapper>
      <Title>Import notes from services</Title>
      <ImportersWrapper>
        <ImporterCard>
          <ServiceImgIcon src="https://i.imgur.com/8eu3Klt.png" />
          <div>
            <h1>Apple Notes</h1>
            <ol>
              <li>Mex will ask for permission to access Notes next</li>
              <li>Pick the notes you would like to see in Mex</li>
              <li>The Notes will be imported under the &#34;Apple Notes&#34; Hierarchy</li>
            </ol>

            <h4>Please close the Apple Notes app if it is open before importing your notes</h4>
            <Button primary large onClick={importAppleNotes}>
              Import Notes
            </Button>
          </div>
        </ImporterCard>
      </ImportersWrapper>
      <ComingSoonWrapper>
        {ComingSoonImporters.map((i) => (
          <ComingSoonImporter key={`ComingSoon_${i.name}`} {...i} />
        ))}
      </ComingSoonWrapper>
    </Wrapper>
  )
}

export default Importers
