import React from 'react'
import searchLine from '@iconify/icons-ri/search-line'
import {
  NavigationButton,
  VerticalSeparator,
  SearchBar,
  UserIcon,
  CreateNewButton,
  NavigationButtons,
  TitlebarControls,
  TitlebarWrapper
} from './style'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import { Icon } from '@iconify/react'
import { ProfileImage } from '../User/ProfileImage'
import { useAuth } from '@workduck-io/dwindle'

const Titlebar = () => {
  const { getUserDetails } = useAuth()

  const userDetails = getUserDetails()

  return (
    <TitlebarWrapper>
      <TitlebarControls>
        <NavigationButtons>
          <NavigationButton>
            <Icon icon={arrowLeftSLine} />
          </NavigationButton>
          <NavigationButton>
            <Icon icon={arrowRightSLine} />
          </NavigationButton>
        </NavigationButtons>
        <VerticalSeparator />
        <CreateNewButton>
          <Icon icon="fa6-solid:file-pen" />
        </CreateNewButton>
      </TitlebarControls>
      <SearchBar>
        <Icon icon={searchLine} />
        <input type="text" placeholder="Search by the Keywords" />
      </SearchBar>
      <UserIcon>
        <ProfileImage email={userDetails?.email} size={28} />
      </UserIcon>
    </TitlebarWrapper>
  )
}

export default Titlebar
