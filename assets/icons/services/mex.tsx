import React from 'react'
import styled from 'styled-components'

type MexIconType = { height: string }

const MexIcon = styled.span<MexIconType>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
`

const Mex: React.FC<MexIconType> = ({ height }) => {
  return <MexIcon height={height} />
}

export default Mex
