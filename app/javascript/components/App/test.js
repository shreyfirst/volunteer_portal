import React from 'react'
import App from './'
import { shallow } from 'enzyme'

const currentUser = {
  id: '1',
  name: 'Craig Day',
  email: 'volunteer@example.com',
  photo: 'https://example.com/photo.jpg',
  isAdmin: true,
  team: null,
  house: {
    id: '1',
    identifier: 'san_francisco',
    name: 'San Francisco',
  },
}

const houses = []
const userPopover = { type: 'user', data: null, anchorEl: null }
const togglePopover = () => {}

test('loads', () => {
  const component = shallow(
    <App
      loading={false}
      currentUser={currentUser}
      houses={houses}
      userPopover={userPopover}
      toggleUserPopover={togglePopover}
    />
  )

  expect(component).toMatchSnapshot()
})
