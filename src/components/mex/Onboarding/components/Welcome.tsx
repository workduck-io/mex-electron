import React from 'react'
import { useTheme } from 'styled-components'
import { Center } from '../../../../style/spotlight/layout'
import { Height, StyledTypography, WelcomeHeader, Wave, StyledKeyCap } from './welcome.style'

const WelcomeSection = () => {
  const theme = useTheme()

  return (
    <Height>
      <WelcomeHeader>
        <StyledTypography size="2rem" color={theme.colors.primary} margin="0" maxWidth="100%">
          Quick Capture
        </StyledTypography>
      </WelcomeHeader>
      {/* <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        Before I take you on a journey of all things magical, you will need to bear with me for just a few steps. Let’s
        start, shall we?
      </StyledTypography>
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        For a seamless experience, all you need to do is remember 3 super easy shortcuts! (Just 3, promise) We can start
        by getting to know you a little ; )
      </StyledTypography> */}
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        Open the browser to the last thought you wanted to quickly capture.
      </StyledTypography>
      <br />
      <Center>
        <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="0.5rem 0 2rem" maxWidth="100%">
          Select it and press <StyledKeyCap>CMD + SHIFT + L </StyledKeyCap>
        </StyledTypography>
      </Center>
    </Height>
  )
}

export default WelcomeSection
