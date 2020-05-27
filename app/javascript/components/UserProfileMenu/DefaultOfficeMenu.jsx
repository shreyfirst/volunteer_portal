import React from 'react'
import {
  Item,
  Separator,
  PreviousItem,
} from '@zendeskgarden/react-dropdowns'

const DefaultHouseMenu = ({ houses, previousMenuValue, selectedItem, t }) =>
<>
  <PreviousItem value={previousMenuValue}>
    {t('volunteer_portal.header.user_profile.default_house')}
  </PreviousItem>
  <Separator />
  {houses.map((house, i) => (
    <Item key={i} value={{ house, language: selectedItem.language }}>
      {house.name}
    </Item>
  ))}
</>

export default DefaultHouseMenu
