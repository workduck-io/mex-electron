import styled, { css } from 'styled-components';

export const RootElement = styled.div`
  position: relative;
`;

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
`;

export const SyncForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme: { spacing } }) => spacing.small};

  background: ${({ theme }) => theme.colors.background.modal};
  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.small}`};
`;

export const FormControls = styled.div`
  display: flex;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.small};
  justify-content: space-between;
`;

interface ServiceSelectorLabelProps {
  checked: boolean;
}
export const ServiceSelectorLabel = styled.label<ServiceSelectorLabelProps>`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 1rem;

  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${({ theme, checked }) =>
    checked
      ? css`
          svg {
            color: ${theme.colors.primary};
          }
          color: ${theme.colors.text.subheading};
          background-color: ${theme.colors.background.highlight};
        `
      : css``}

  input[type='checkbox'] {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
  }
`;

export const ServiceLabel = styled.div`
  display: flex;
  align-items: center;
  text-transform: capitalize;

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`;
