import React from 'react'
import { graphql, compose } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { graphQLError } from 'actions'

import HouseForm from './form'
import Loading from 'components/LoadingIcon'

import HouseQuery from './queries/show.gql'
import UpdateHouseMutation from './mutations/update.gql'

const EditHouse = ({ data: { networkStatus, house }, updateHouse }) =>
  networkStatus === NetworkStatus.loading ? <Loading /> : <HouseForm house={house} onSubmit={updateHouse} />

const buildOptimisticResponse = house => ({
  __typename: 'Mutation',
  updateHouse: {
    __typename: 'House',
    ...house,
  },
})

const withData = compose(
  graphql(HouseQuery, {
    options: ({ params: { id } }) => ({
      variables: { id },
    }),
  }),
  graphql(UpdateHouseMutation, {
    props: ({ ownProps, mutate }) => ({
      updateHouse: house =>
        mutate({
          variables: { input: R.omit(['identifier', '__typename'], house) },
          optimisticResponse: buildOptimisticResponse(house),
        })
          .then(_response => {
            ownProps.router.push('/portal/admin/houses')
          })
          .catch(({ graphQLErrors }) => {
            ownProps.graphQLError('house', graphQLErrors)
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

export default withActions(withData(EditHouse))
