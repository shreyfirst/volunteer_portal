import React from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { graphQLError } from 'actions'

import HouseForm from './form'

import HousesQuery from './queries/index.gql'
import CreateHouseMutation from './mutations/create.gql'

const NewHouse = ({ createHouse }) => <HouseForm onSubmit={createHouse} />

const buildOptimisticResponse = ({ name, timezone }) => ({
  __typename: 'Mutation',
  createHouse: {
    __typename: 'House',
    id: '-1',
    identifier: name.toLowerCase(),
    name,
    timezone,
  },
})

const withData = graphql(CreateHouseMutation, {
  props: ({ ownProps, mutate }) => ({
    createHouse: house =>
      mutate({
        variables: { input: house },
        optimisticResponse: buildOptimisticResponse(house),
        update: (proxy, { data: { createHouse } }) => {
          const { houses } = proxy.readQuery({ query: HousesQuery })
          const withNewHouse = R.append(createHouse, houses)
          proxy.writeQuery({ query: HousesQuery, data: { houses: withNewHouse } })
        },
      })
        .then(_response => {
          ownProps.router.push('/portal/admin/houses')
        })
        .catch(({ graphQLErrors }) => {
          ownProps.graphQLError(graphQLErrors)
        }),
  }),
})

const mapStateToProps = (state, ownProps) => ({})

const withActions = connect(
  mapStateToProps,
  {
    graphQLError,
  }
)

export default withActions(withData(NewHouse))
