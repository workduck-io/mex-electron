import { Icon } from '@iconify/react'
import React from 'react'
import styled from 'styled-components'
import { Header } from './Shortcuts'
import twitterIcon from '@iconify-icons/logos/twitter'
import globeIcon from '@iconify-icons/ph/globe'
import linkedinIcon from '@iconify-icons/logos/linkedin-icon'
import { getGlobal } from '@electron/remote'

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
  console.log('Value is: ', getGlobal('appVersion'))
  const appVersion = getGlobal('appVersion')

  return (
    <Container>
      <Header colored>Mex</Header>
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
    </Container>
  )
}

export default About
