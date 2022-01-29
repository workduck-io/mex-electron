import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { mog } from '../../../../../utils/lib/helper'
import useOnboard from '../../../../../store/useOnboarding'
import { StyledModal } from '../../../Lookup'
import { useOnboardingData } from '../../hooks'
import { Container, StyledHeading, StyledList } from './styled'
import { MexIcon } from '../../../../../style/Layouts'
import { quickLinkTour } from '../../steps'

export type GettingStartedListProps = {
  title: string
  icon: string
  step: number
}

const GettingStartedList: Array<GettingStartedListProps> = [
  {
    title: 'Quick Link',
    icon: 'ri:file-list-2-line',
    step: 0
  },
  {
    title: 'Snippets',
    icon: 'ri:quill-pen-line',
    step: quickLinkTour.length
  },
  {
    title: 'Flow Links',
    icon: 'ri:refresh-fill',
    step: 7
  },
  {
    title: 'Inline Block',
    icon: 'ri:picture-in-picture-line',
    step: 10
  },
  {
    title: 'Tags',
    icon: 'ri:hashtag',
    step: 14
  },
  {
    title: 'Quick Capture',
    icon: 'ri:checkbox-multiple-blank-fill',
    step: 18
  }
]

// eslint-disable-next-line @typescript-eslint/ban-types
type GettingStartedProps = {}

const GettingStarted: React.FC<GettingStartedProps> = () => {
  const { isOpen, setIsOpen, setStep } = useOnboard((store) => ({
    setStep: store.setStep,
    isOpen: store.isModalOpen,
    setIsOpen: store.setModal
  }))

  const handleClose = () => {
    setIsOpen(false)
  }

  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const { setOnboardData } = useOnboardingData()

  const history = useHistory()
  const location = useLocation()

  const onTourClick = (item: GettingStartedListProps) => {
    // * Set Integration data (Like tour flow block)
    setOnboardData(item)

    // * If not on editor page
    if (location.pathname !== '/editor') {
      history.push('/editor')
    }

    // * Start Product Tour
    changeOnboarding(true)
  }

  mog('Getting started', { isOpen })

  return (
    <StyledModal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={handleClose} isOpen={isOpen}>
      <Container>
        <StyledHeading>Getting Started.</StyledHeading>
        <StyledList>
          {GettingStartedList.map((item, index) => {
            const onClick = () => {
              onTourClick(item)
              handleClose()
              setStep(item.step)
            }

            return (
              <li key={item.title} onClick={onClick}>
                <MexIcon fontSize={24} margin="0 2rem 0 0" icon={item.icon} />
                {item.title}
              </li>
            )
          })}
        </StyledList>
      </Container>
    </StyledModal>
  )
}

export default GettingStarted
