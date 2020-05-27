import React from 'react'
import { graphql, compose } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'

import { graphQLError } from 'actions'

import UserForm from './form'
import Loading from 'components/LoadingIcon'

import UserQuery from './queries/show.gql'
import UpdateUserMutation from './mutations/update.gql'

const EditUser = ({ data: { networkStatus, user, houses }, updateUser }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <UserForm user={user} houses={houses} onSubmit={updateUser} />
  )

const buildOptimisticResponse = user => ({
  __typename: 'Mutation',
  updateUser: {
    __typename: 'User',
    ...user,
  },
})

const withData = compose(
  graphql(UserQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateUserMutation, {
    props: ({ ownProps, mutate }) => ({
      updateUser: user => {
        const userInput = { id: user.id, houseId: user.house.id, isAdmin: user.isAdmin }
        return mutate({
          variables: { input: userInput },
          optimisticResponse: buildOptimisticResponse(user),
        })
          .then(_response => {
            ownProps.router.push('/portal/admin/users')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('user', graphQLErrors)
          })
      },
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

export default withActions(withData(EditUser))
