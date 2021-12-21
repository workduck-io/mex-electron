import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import { capitalize } from '../../../Lib/strings'
import Plus from '@iconify-icons/bi/plus'
import { ServiceIcon } from '../../../Editor/Components/SyncBlock/SyncIcons'
import {
  FullFlex,
  IconCircle,
  ServiceChip,
  SyncedServices,
  TemplateBody,
  TemplateCard,
  TemplateCommand,
  TemplateDesc,
  TemplateHeader,
  TemplateTitle,
  ServiceType
} from './styled'
import { SyncBlockTemplate } from '../../../Editor/Components/SyncBlock'

const MAX_SHOW = 3

const Template: React.FC<{ template: SyncBlockTemplate; onClick?: any; selected }> = ({
  template,
  selected,
  onClick
}) => {
  const { intents, more } = useMemo(() => {
    const intents = template.intents.filter((intent) => intent.service !== 'MEX')
    const more = intents.slice(MAX_SHOW).length

    return { intents, more }
  }, [template])

  return (
    <TemplateCard selected={selected} onClick={() => onClick(template)}>
      <TemplateHeader>
        <FullFlex>
          <TemplateCommand>/flow.{template.command}</TemplateCommand>
        </FullFlex>
      </TemplateHeader>
      <TemplateBody>
        <TemplateTitle>{template.title}</TemplateTitle>
        <TemplateDesc>{template.description}</TemplateDesc>
      </TemplateBody>
      <SyncedServices>
        {intents.map((intent) => (
          <ServiceChip key={intent.service}>
            <IconCircle>
              <ServiceIcon service={intent.service} height="16px" width="16px" />
            </IconCircle>
            <ServiceType>{capitalize(intent.type)}</ServiceType>
          </ServiceChip>
        ))}
        {more > 0 && (
          <ServiceChip>
            <IconCircle>
              <Icon height={16} icon={Plus} />
            </IconCircle>
            <ServiceType>{`${more} more`}</ServiceType>
          </ServiceChip>
        )}
      </SyncedServices>
    </TemplateCard>
  )
}

export default Template
