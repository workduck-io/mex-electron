import linkedinIcon from '@iconify/icons-logos/linkedin-icon'
import twitterIcon from '@iconify/icons-logos/twitter'
import globeIcon from '@iconify/icons-ph/globe'
import { Icon } from '@iconify/react'
import { ipcRenderer } from 'electron'
import React from 'react'
import styled from 'styled-components'
import { IpcAction } from '../../../data/IpcAction'
import { AppType } from '../../../hooks/useInitialize'
import { useVersionStore } from '../../../store/useAppDataStore'
import useOnboard from '../../../store/useOnboarding'
import { BackCard } from '../../../style/Card'
import { CenteredColumn } from '../../../style/Layouts'
import { Title } from '../../../style/Typography'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'

const Container = styled.section`
  margin: 0 ${({ theme }) => theme.spacing.large};
`

const Margin = styled.div`
  margin: 0.5rem 1rem;
`

const Links = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.default};
  margin-right: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  background: none;
`

const StyledIcon = styled(Icon)`
  margin-right: 0.4rem;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const About = () => {
  const appVersion = useVersionStore((store) => store.version)
  const { goTo } = useRouting()
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const setStep = useOnboard((s) => s.setStep)

  const onBeginTourClick = () => {
    goTo(ROUTE_PATHS.node, NavigationType.replace)
    setStep(0)
    changeOnboarding(true)
    ipcRenderer.send(IpcAction.START_ONBOARDING, { from: AppType.MEX })
  }

  const importAppleNotes = () => {
    ipcRenderer.send(IpcAction.IMPORT_APPLE_NOTES)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title colored>Mex</Title>
        <Margin>Version: {appVersion}</Margin>
        <Margin>
          <Flex>
            <Links href="https://workduck.io" target="_blank" rel="noopener norefer">
              <StyledIcon icon={globeIcon} />
              <h4>Website</h4>
            </Links>
            <Links href="https://www.linkedin.com/company/workduck-official" target="_blank" rel="noopener norefer">
              <StyledIcon icon={linkedinIcon} />
              <h4>Linkedin</h4>
            </Links>
            <Links href="https://twitter.com/workduckio" target="_blank" rel="noopener norefer">
              <StyledIcon icon={twitterIcon} />
              <h4>Twitter</h4>
            </Links>
          </Flex>
        </Margin>
        <br />
      </BackCard>
    </CenteredColumn>
  )
}

export default About
