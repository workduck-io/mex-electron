import { AccessLevel } from '../../../types/mentions'
import React from 'react'
import { SAccessTag } from '@editor/Components/mentions/components/MentionElement.styles'
import { AccessNames } from '@data/Defaults/accessNames'
import { AccessIcon } from '@components/icons/access'

interface AccessTagProps {
  access: AccessLevel
}

const AccessTag = ({ access }: AccessTagProps) => {
  return (
    <SAccessTag>
      <AccessIcon access={access} />
      <span>{AccessNames[access]}</span>
    </SAccessTag>
  )
}

export default AccessTag
