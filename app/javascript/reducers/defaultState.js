const defaultState = {
  showFilter: { value: 'all' },
  eventFilter: { value: 'all' },
  houseFilter: { value: null },
  dashboardHouseFilter: { value: 'current' },
  adminHouseFilter: { value: 'current' },
  popover: { type: 'event', data: null, anchorEl: null },
  currentUser: {},
  calendarDate: new Date(),
  reportingStartDate: null,
  reportingStartEnd: null,
}

export default defaultState
