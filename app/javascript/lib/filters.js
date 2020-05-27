export function houseFilter(eventAndFilters) {
  // eslint-disable-line import/prefer-default-export
  const { event, houseFilter, isValid } = eventAndFilters

  if (!isValid) {
    return eventAndFilters
  }

  if (houseFilter.value === 'all') {
    return eventAndFilters
  }
  const houseMatches = event.houseId === houseFilter.value
  return { ...eventAndFilters, isValid: houseMatches }
}
