import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import { capitalize } from '../../../Lib/strings'
import Plus from '@iconify-icons/bi/plus'
import trashIcon from '@iconify-icons/codicon/trash'
import { ServiceIcon } from '../../../Editor/Components/SyncBlock/SyncIcons'
import {
  DeleteIcon,
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
import { useConfirmationModalStore } from '../../ConfirmationModal/ConfirmationModal'
import { SyncBlockTemplate } from '../../../Editor/Components/SyncBlock'

const MAX_SHOW = 3

const Template: React.FC<{ template: SyncBlockTemplate }> = ({ template }) => {
  const { intents, more } = useMemo(() => {
    const intents = template.intents.filter((intent) => intent.service !== 'MEX')
    const more = intents.slice(MAX_SHOW).length

    return { intents, more }
  }, [template.intents])
  const openConfirmationModal = useConfirmationModalStore((store) => store.openModal)

  const handleDeleteModal = () => {
    openConfirmationModal(template.id, `Delete: ${template.title}?`, 'Are you sure you want to delete the template?')
  }

  return (
    <TemplateCard>
      <TemplateHeader>
        <FullFlex>
          <TemplateCommand>/sync.{template.command}</TemplateCommand>
        </FullFlex>
        <DeleteIcon onClick={handleDeleteModal}>
          <Icon height={18} icon={trashIcon} />
        </DeleteIcon>
      </TemplateHeader>
      <TemplateBody>
        <TemplateTitle>{template.title}</TemplateTitle>
        <TemplateDesc>{template.description}</TemplateDesc>
      </TemplateBody>
      <SyncedServices>
        {intents.map((intent) => (
          <ServiceChip key={intent.service}>
            <IconCircle>
              <ServiceIcon service={intent.service} height="16" width="16" />
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
