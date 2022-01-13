import React from 'react'
import { Margin, TemplateContainer , Title } from '../../Styled/Integration'
import CollabEditor from './CollabEditor'

const Collab = () => {
  return (
    <TemplateContainer>
      <Title>Collab</Title>
      <CollabEditor nodeId="NODE_ONE" />
      <Margin />
      <CollabEditor nodeId="NODE_TWO" />
    </TemplateContainer>
  )
}

export default Collab
