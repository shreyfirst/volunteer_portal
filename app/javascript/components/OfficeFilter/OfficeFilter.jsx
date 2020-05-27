import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import * as R from 'ramda'
import { Dropdown, Field, Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
import { withTranslation } from 'react-i18next'

import Error from './HouseFilterError'
import Loading from './HouseFilterLoading'
import HousesQuery from './query.gql'
import { FilterContext, houseFilterValueLens } from '/context'

const HouseFilter = ({ t }) => {
  const { filters, setHouseValue } = useContext(FilterContext)
  const { data, loading, error } = useQuery(HousesQuery)

  if (loading) return <Loading />
  if (error) return <Error />

  const options = R.propOr([], 'houses', data)
  const all = { id: 'all', name: t('volunteer_portal.dashboard.layouteventstab.house_all') }
  const value = R.view(houseFilterValueLens, filters)
  const selectedItem = R.find(R.propEq('id', value))(options) || all

  return (
    <Dropdown
      selectedItem={selectedItem}
      onSelect={option => setHouseValue(option.id)}
      downshiftProps={{ itemToString: option => option && option.name }}
    >
      <Field>
        <Select>
          <strong>{t('volunteer_portal.dashboard.layouteventstab.house')}</strong> {selectedItem.name}
        </Select>
      </Field>
      <Menu>
        {[all, ...options].map(option => (
          <Item key={option.id} value={option}>
            {option.name}
          </Item>
        ))}
      </Menu>
    </Dropdown>
  )
}

export default withTranslation()(HouseFilter)
