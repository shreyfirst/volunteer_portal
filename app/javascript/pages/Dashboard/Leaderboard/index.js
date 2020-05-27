import React, { useState, useContext } from 'react'

import * as R from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import { Alert, Title, Paragraph } from '@zendeskgarden/react-notifications'
import { MD, LG } from '@zendeskgarden/react-typography'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { Tag } from '@zendeskgarden/react-tags'

import LeaderboardQuery from './leaderboardQuery.gql'
import ListItem from 'components/ListItem'
import NamedAvatar from 'components/NamedAvatar'
import HouseFilter from 'components/HouseFilter'
import { FilterContext, houseFilterValueLens } from 'context'

import { withTranslation, useTranslation } from 'react-i18next'

const { zdSpacingXxs, zdColorGrey300 } = require('@zendeskgarden/css-variables')

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${zdColorGrey300};
  margin-bottom: ${zdSpacingXxs};
  padding-bottom: ${zdSpacingXxs};
`
const SectionTitle = styled(LG)`
  align-self: flex-end;
`

const Loader = _props => (
  <>
    {Array(10)
      .fill()
      .map((_, i) => (
        <ListItem key={i}>
          <NamedAvatar loading />
          <MD>
            <Skeleton width="6rem" />
          </MD>
        </ListItem>
      ))}
  </>
)

// The server expects seconds since epoch, not milliseconds
const startOfYear = Math.floor(moment().startOf('year') / 1000)
const nowInSec = moment().unix()
const leaderBoardSize = 10
const leaderBoardSort = 'HOURS_DESC'

const Leaderboard = _props => {
  const { filters } = useContext(FilterContext)
  const { loading, error, data } = useQuery(LeaderboardQuery, {
    variables: {
      after: startOfYear,
      before: nowInSec,
      count: leaderBoardSize,
      houseId: R.view(houseFilterValueLens, filters),
      sortBy: leaderBoardSort,
    },
  })

  const volunteers = R.propOr([], 'volunteers', data)

  if (error) console.log(error)

  return (
    <div>
      <SectionHeader>
        <SectionTitle>{_props.t('volunteer_portal.admin.tab.user.dashboard.topvolunteers')}</SectionTitle>
        <HouseFilter />
      </SectionHeader>
      <div>
        {error && (
          <Alert type="error">
            <Title>{_props.t('volunteer_portal.admin.tab.user.dashboard.networkerror')}</Title>
            {_props.t('volunteer_portal.admin.tab.user.dashboard.networkerrormessage')}
          </Alert>
        )}

        {loading && <Loader />}

        {volunteers.map((user, i) => (
          <ListItem key={`user-${i}`}>
            <NamedAvatar image={user.photo} name={user.name} />
            <MD>
              <Tag isPill size="large">
                {user.hours}
              </Tag>{' '}
              hours
            </MD>
          </ListItem>
        ))}

        {!volunteers.length && (
          <Paragraph>🤭 {_props.t('volunteer_portal.admin.tab.user.dashboard.nousersfound')}</Paragraph>
        )}
      </div>
    </div>
  )
}

export default withTranslation()(Leaderboard)
