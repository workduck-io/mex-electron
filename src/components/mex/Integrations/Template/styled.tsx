import styled, { css } from 'styled-components'

export const TemplateCard = styled.div<{ selected: boolean }>`
  margin: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background.card};
  height: 10rem;
  width: 440px;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 0.2rem;
  font-weight: bold;

  ${({ theme, selected }) =>
    selected
      ? css`
          border: 0.2rem solid ${theme.colors.primary};
          padding: 0;
        `
      : css`
          :hover {
            border: 0.2rem solid ${({ theme }) => theme.colors.background.highlight};
            padding: 0;
          }
        `}
`

export const Ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const ServiceType = styled.span`
  ${Ellipsis};
`

export const DeleteIcon = styled.span`
  margin-right: 0.4rem;
`

export const TemplateHeader = styled.div`
  display: flex;
  margin-top: 0.4rem;

  margin-left: 0.4rem;
  align-items: center;
`

export const FullFlex = styled.div`
  flex: 1;
`

export const IconCircle = styled.div`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.small};
  height: 1.6rem;
  width: 1.6rem;
  background-color: ${({ theme }) => theme.colors.background.modal};
`

export const TemplateTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  max-width: 20rem;
  font-size: 1rem;
  line-height: 1.1rem;
  ${Ellipsis};
`

export const TemplateDesc = styled.div`
  font-style: normal;
  line-height: 1.1rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.9rem;
  margin-top: 0.2rem;
  line-height: 0.95rem;

  ${Ellipsis};
`

export const TemplateCommand = styled.div`
  padding: 0.4rem 0.6rem;
  width: fit-content;
  max-width: 20rem;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  color: ${({ theme }) => theme.colors.text.fade};

  ${Ellipsis};
`

export const TemplateBody = styled.div`
  flex: 1;
  margin: 0.5rem 0;
  padding: 0.4rem 0.6rem;
`

export const SyncedServices = styled.div`
  display: flex;
  margin-bottom: 0.4rem;
  align-items: center;
`

export const ServiceChip = styled.div`
  border-radius: 1rem;
  margin-left: 0.6rem;
  box-shadow: -1px 2px 4px rgba(0, 0, 0, 0.4);
  min-width: 6rem;
  max-width: 8rem;
  display: flex;
  font-weight: normal;
  font-size: 0.85rem;
  padding: 0.3rem 0.4rem;
  align-items: center;
  height: 2rem;
  background: ${({ theme }) => theme.colors.background.highlight};
`
