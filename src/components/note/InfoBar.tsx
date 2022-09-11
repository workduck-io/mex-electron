import React from 'react'

import { FlexGap } from '@components/mex/Archive/styled'
import ArchiveIcon from '@iconify/icons-ri/archive-fill'
import { useTheme } from 'styled-components'

import { MexIcon } from '@workduck-io/mex-components'

import { StyledInfoBar } from './styled'

type InfoBarType = {
  archived: boolean
}

const InfoBar = ({ archived }: InfoBarType) => {
  const theme = useTheme()

  if (!archived) return <></>

  return (
    <StyledInfoBar>
      <FlexGap>
        <MexIcon icon={ArchiveIcon} noHover color={theme.colors.text.heading} width="20" height="20" />
        <span>This Note is archived!</span>
      </FlexGap>
    </StyledInfoBar>
  )
}

export default InfoBar
