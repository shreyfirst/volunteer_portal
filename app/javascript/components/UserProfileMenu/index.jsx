import React, { useState, useContext } from 'react'
import * as R from 'ramda'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'

import {
  Dropdown,
  Trigger,
  Menu as GardenMenu,
} from '@zendeskgarden/react-dropdowns'
import { Avatar } from '@zendeskgarden/react-avatars'
import { MD } from '@zendeskgarden/react-typography'

import UpdateUserHouseMutation from '/mutations/UpdateUserHouseMutation.gql'
import { UserContext, FilterContext } from '/context'
import GeneralSettingsMenu from './GeneralSettingsMenu'
import DefaultHouseMenu from './DefaultHouseMenu'
import LanguageMenu from './LanguageMenu'

const UserDetails = styled.div`
  margin-left: ${({ theme }) => theme.space.sm};
`

const UserProfileContainer = styled.button`
  display: flex;
  border: none;
  text-align: left;
  background: none;
`

const UserName = styled(MD)`
  font-weight: bold;
`

const UserProfileMenu = ({ houses, location, router, togglePopover }) => {
  const languages = [
    { label: 'English', value: 'en' },
    // Enable when Japanense is supported
    // { label: '日本語', value: 'ja' }
  ]
  
  const { i18n, t } = useTranslation()
  const { currentUser, setHouse } = useContext(UserContext)
  const { setHouseValue } = useContext(FilterContext)
  const [ isOpen, setIsOpen ] = useState(false)
  const [ tempSelectedItem, setTempSelectedItem ] = useState()
  const [ selectedItem, setSelectedItem ] = useState({ house: currentUser.house, language: languages[0] })
  const [ updateDefaultHouse ] = useMutation(UpdateUserHouseMutation)

  if (R.isNil(currentUser) || R.isEmpty(currentUser)) return null

  const handleHouseSelect = house =>
    updateDefaultHouse({ variables: { userId: currentUser.id, houseId: house.id } })
      .then(response => setHouse(R.path(['data', 'updateUserHouse', 'house'], response)))
      .then(_ => setHouseValue(house.id))
      .then(_ => togglePopover('user'))


  const handleStateChange = (changes, stateAndHelpers) => {
    if (R.hasPath(['isOpen'])(changes)) {
      setIsOpen(
        changes.selectedItem === 'default-house' ||
        changes.selectedItem === 'language-settings' ||
        changes.selectedItem === 'general-settings' ||
        changes.isOpen
      )
    }

    if (R.hasPath(['selectedItem'])(changes)) {
      const itemSelected = R.prop('selectedItem')(changes)
      if (itemSelected === 'general-settings') {
        switch (tempSelectedItem) {
          case 'default-house':
            stateAndHelpers.setHighlightedIndex(0)
            break
          case 'language-settings':
            stateAndHelpers.setHighlightedIndex(1)
        }
      }
      setTempSelectedItem(itemSelected)
    }
  }

  const handleSelect = selectedItem => {
    if (tempSelectedItem === 'default-house') {
      if (R.hasPath(['house'])(selectedItem)) {
        handleHouseSelect(selectedItem.house)
        setSelectedItem(selectedItem)
      }
    } else if (tempSelectedItem === 'language-settings') {
      if (R.hasPath(['language'])(selectedItem)) {
        i18n.changeLanguage(selectedItem.language.value, () => {
          // TODO: Handle callback (error/success)
        })
        setSelectedItem(selectedItem)
      }
      // The following are for accessibility support for Link navigation
    } else if (selectedItem === 'admin') {
      router.push('/portal/admin')
    } else if (selectedItem === 'home') {
      router.push('/portal')
    } else if (selectedItem === 'sign-out') {
      window.location.href = '/users/sign_out'
    }
  }

  const renderItems = () => {
    if (tempSelectedItem === 'default-house') {
      return <DefaultHouseMenu houses={houses} previousMenuValue="general-settings" selectedItem={selectedItem} t={t} />
    } else if (tempSelectedItem === 'language-settings') {
      return <LanguageMenu languages={languages} previousMenuValue="general-settings" selectedItem={selectedItem} t={t} />
    } else {
      return <GeneralSettingsMenu menuValues={{ defaultHouse: 'default-house', languageSettings: 'language-settings'}} isAdmin={currentUser.isAdmin} pathname={location.pathname} t={t} />
    }
  }

  return (
    <Dropdown
      selectedItem={selectedItem}
      // This is used to detect what items are selected with a check mark.
      downshiftProps={{
        itemToString: item => (item.house && item.house.id) + (item.language && item.language.value),
      }}
      isOpen={isOpen}
      onStateChange={handleStateChange}
      onSelect={handleSelect}
    >
      <Trigger>
        {
          R.isNil(currentUser) || R.isEmpty(currentUser) ? null :
          <UserProfileContainer>
            <Avatar>
              <img src={currentUser.photo} alt="User Avatar" />
            </Avatar>
            <UserDetails>
              <UserName>{currentUser.name}</UserName>
              <MD>{currentUser.house && currentUser.house.name}</MD>
            </UserDetails>
          </UserProfileContainer>
        }
      </Trigger>
      <GardenMenu hasArrow>{renderItems()}</GardenMenu>
    </Dropdown>
  )
}

export default withRouter(UserProfileMenu)
