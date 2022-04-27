import styled, { css } from 'styled-components'
import { FullWidth } from '../Screen/List'

export const StyledActionFormContainer = styled(FullWidth)`
  margin-top: 1rem;
  /* padding: 0 ${({ theme }) => theme.spacing.medium}; */
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  overflow-y: auto;
  flex: 3;

  ${({ narrow }) =>
    narrow
      ? css`
          height: calc(84vh - 5rem);
        `
      : css`
          height: 84vh;
        `}

  /* padding-bottom: 10rem; */
  display: flex;
  /* align-items: center; */
  flex-direction: column;
`

export const ActionRow = styled.div<{ isRow?: boolean }>`
  display: flex;
  margin: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  gap: 0 1rem;
  min-width: 60vw;
  max-width: 60vw;
`
