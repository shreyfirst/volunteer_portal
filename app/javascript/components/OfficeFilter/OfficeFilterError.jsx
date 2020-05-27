import React from 'react'

import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withTranslation } from 'react-i18next'
import AlertWarning from '@zendeskgarden/svg-icons/src/16/alert-error-fill.svg'

const HouseFilterError = ({ t }) => (
  <Dropdown>
    <Field>
      <Select selectedItem="">
        <strong>{t('volunteer_portal.dashboard.layouteventstab.house')}</strong> <AlertWarning />
      </Select>
    </Field>
    <Menu>
      <Item value="error">{t('volunteer_portal.filters.house.fetch_error')}</Item>
    </Menu>
  </Dropdown>
)

export default withTranslation()(HouseFilterError)
