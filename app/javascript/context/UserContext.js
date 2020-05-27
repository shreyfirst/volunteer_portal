import React, { useState, useCallback } from 'react'

import * as R from 'ramda'

const preferenceLens = R.lensProp('preference')
const houseLens = R.lensProp('house')

export const UserContext = React.createContext(null)

export const UserContextProvider = ({ user, children }) => {
  const [currentUser, setCurrentUser] = useState(user)

  const setHouse = useCallback(house => setCurrentUser(R.set(houseLens, house)), [])
  const setPreference = useCallback(pref => setCurrentUser(R.set(preferenceLens, pref)), [])
  const clear = useCallback(() => setCurrentUser(undefined), [])

  const ctx = {
    currentUser,
    setHouse,
    setPreference,
    clear,
  }

  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>
}
