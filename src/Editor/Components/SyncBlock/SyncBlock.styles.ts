import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const RootElement = styled.div`
  position: relative;
`

// Input

export const ElementHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.subheading};

  svg {
    margin-right: ${({ theme }) => theme.spacing.tiny};
  }
  margin-bottom: ${({ theme }) => theme.spacing.small};
`

export const SyncTitle = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  color: ${({ theme }) => theme.colors.primary};

  align-self: flex-end;
`

interface SyncFormProps {
  selected: boolean
}

export const SyncForm = styled.form<SyncFormProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin: ${({ theme }) => theme.spacing.small} 0;
  padding: 0;

  /* background: ${({ theme }) => theme.colors.background.card}; */
  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.small}`};

  textarea.syncTextArea {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    background-color: transparent;
    ${({ selected }) =>
      selected &&
      css`
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
      `}
  }

  button {
    display: block;
    height: 100%;
  }
`
export const FormControls = styled.div`
  display: flex;
  width: 100%;
  z-index: 100;
  position: absolute;
  margin-top: ${({ theme }) => theme.spacing.small};
  justify-content: space-between;
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.gray[9])};
  backdrop-filter: blur(10px);
  bottom: -${({ theme }) => theme.spacing.small};
  transform: translateY(100%);
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const ServiceSelectorLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 1rem;

  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  input[type='checkbox'] {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
  }
`

export const ServiceLabel = styled.div`
  display: flex;
  align-items: center;
  text-transform: capitalize;

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`
