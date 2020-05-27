import React from 'react'
import { graphql, compose } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { graphQLError } from 'actions'

import EventForm from './form'
import UserList from 'components/UserList'
import Loading from 'components/LoadingIcon'
import { extractIdFromAssociations } from './utils'

import EventQuery from './queries/show.gql'
import UpdateEventMutation from './mutations/update.gql'
import DestroySignupMutation from 'mutations/DestroySignupMutation.gql'

const EditEvent = ({
  data: { networkStatus, event, eventTypes, tags, houses, organizations },
  updateEvent,
  destroySignup,
}) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <EventForm
      event={event}
      eventTypes={eventTypes}
      tags={tags}
      houses={houses}
      organizations={organizations}
      onSubmit={updateEvent}
    >
      <UserList users={event.users} onRemove={user => destroySignup(event, user)} />
    </EventForm>
  )

const buildOptimisticResponse = event => ({
  __typename: 'Mutation',
  updateEvent: {
    __typename: 'Event',
    ...event,
  },
})

const withData = compose(
  graphql(EventQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateEventMutation, {
    props: ({ ownProps, mutate }) => ({
      updateEvent: event =>
        mutate({
          variables: { input: R.omit(['__typename', 'users'], extractIdFromAssociations(event)) },
          optimisticResponse: buildOptimisticResponse(event),
        })
          .then(_response => {
            ownProps.router.push('/portal/admin/events')
          })
          .catch(something => {
            ownProps.graphQLError('event', something.graphQLErrors)
          }),
    }),
  }),
  graphql(DestroySignupMutation, {
    props: ({ mutate }) => ({
      destroySignup: (event, user) =>
        mutate({
          variables: { eventId: event.id, userId: user.id },
          optimisticResponse: {
            __typename: 'Mutation',
            destroySignup: {
              __typename: 'Signup',
              event: R.merge(event, {
                users: R.reject(u => u.id === user.id, event.users),
              }),
            },
          },
        }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
  }
)

export default withActions(withData(EditEvent))
