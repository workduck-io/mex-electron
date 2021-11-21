import { Icon } from '@iconify/react'
import React from 'react'
import styled from 'styled-components'
import { Header } from './Shortcuts'
import globeIcon from '@iconify-icons/ph/globe'
import linkedinIcon from '@iconify-icons/logos/linkedin-icon'

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
  return (
    <Container>
      <Header colored>Mex</Header>
      <Margin>Version: 0.1.0</Margin>
      <Margin>
        <Flex>
          <Links href="https://workduck.io">
            <StyledIcon icon={globeIcon} />
            <h4>Website</h4>
          </Links>
          <Links href="https://www.linkedin.com/company/workduck-official">
            <StyledIcon icon={linkedinIcon} />
            <h4>Linkedin</h4>
          </Links>
        </Flex>
      </Margin>
    </Container>
  )
}

export default About
