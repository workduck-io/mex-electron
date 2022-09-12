<<<<<<< HEAD
import { IconWrapper } from '@ui/components/IconPicker/IconPicker.style'
import { Ellipsis } from '@workduck-io/mex-components'
import styled, { css } from 'styled-components'

export const NamespaceText = styled.span`
  min-width: 4rem;
  max-width: 8rem;
  ${Ellipsis}
`

=======
import styled, { css } from 'styled-components'

>>>>>>> 672ed844 (activeNamespace in useUserPreferences, and lookup namespace tags)
export const StyledNamespaceTag = styled.div<{ separator?: boolean }>`
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  padding-left: 0.25rem;
<<<<<<< HEAD
  ${Ellipsis}
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.tiny};

  ${IconWrapper} {
    flex-shrink: 0;
  }

  ${({ theme, separator }) =>
    separator &&
    css`
      border-left: 1px solid ${theme.colors.gray[7]};
    `}
`
=======
  margin-left: 0.5rem;
  ${({ theme, separator }) => separator && css`
    border-left: 1px solid ${theme.colors.text.disabled};
  `
  }
` 
>>>>>>> 672ed844 (activeNamespace in useUserPreferences, and lookup namespace tags)
