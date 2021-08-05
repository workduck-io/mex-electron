import styled, { css } from 'styled-components';

interface IFrameWrapperProps {
  expand: boolean;
}

export const IFrameWrapper = styled.div<IFrameWrapperProps>`
  position: relative;
  transition: padding 0.2s ease-in-out;

  padding: ${({ expand }) => (expand ? `75% 0 0 0` : `50% 0 0 0`)};
`;

export const RootElement = styled.div`
  position: relative;
`;

// Input

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: 0.85rem;

  margin-top: ${({ theme }) => theme.borderRadius.small};

  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.secondary};

  :focus-within {
    background: ${({ theme }) => theme.colors.background.card};
  }
`;

export const InputPrompt = styled.div`
  display: flex;
  align-items: center;
  max-width: 4rem;

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`;

export const MediaInput = styled.input`
  width: 100%;

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  padding-left: 0;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: none;

  border-top-right-radius: ${({ theme }) => theme.borderRadius.small};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.small};

  :focus {
    background-color: ${({ theme }) => theme.colors.background.card};
    outline: none;
  }
`;

export const MediaHtml = styled.div`
  > div {
    display: flex;
  }
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.small}`};
  blockquote {
    &.twitter-tweet {
      margin: 0;
      padding: ${({ theme: { spacing } }) =>
        `${spacing.medium} ${spacing.large}`};
    }
  }

  iframe[src*='youtube'],
  iframe[src*='youtu.be'] {
    min-width: 100%;
    min-height: 500px;
  }
`;

export const ElementHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};

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

  background: ${({ theme }) => theme.colors.background.surface};
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
          color: ${theme.colors.primary};
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
