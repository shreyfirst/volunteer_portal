import React, { useState, useCallback } from 'react'

import * as R from 'ramda'

const initialState = {
  houseFilter: { value: undefined },
  eventFilter: { value: undefined },
  showFilter: { value: undefined },
}

export const houseFilterValueLens = R.lensPath(['houseFilter', 'value'])
export const eventFilterValueLens = R.lensPath(['eventFilter', 'value'])
export const showFilterValueLens = R.lensPath(['showFilter', 'value'])

const setInitialState = user => R.set(houseFilterValueLens, R.path(['house', 'id'], user), initialState)

export const FilterContext = React.createContext(initialState)

export const FilterContextProvider = ({ user, children }) => {
  const [filters, setFilters] = useState(setInitialState(user))

  const setHouseValue = useCallback(id => setFilters(R.set(houseFilterValueLens, id)), [])
  const setEventValue = useCallback(id => setFilters(R.set(eventFilterValueLens, id)), [])
  const setShowValue = useCallback(v => setFilters(R.set(showFilterValueLens, v)), [])

  const ctx = {
    filters,
    setHouseValue,
    setEventValue,
    setShowValue,
  }

  return <FilterContext.Provider value={ctx}>{children}</FilterContext.Provider>
}
