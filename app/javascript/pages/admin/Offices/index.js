import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { NetworkStatus } from 'apollo-client'
import * as R from 'ramda'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import Dialog from 'material-ui/Dialog'
import { Button } from '@zendeskgarden/react-buttons'
import { defaultFilterMethod } from 'lib/utils'

import { graphQLError, togglePopover } from 'actions'

import Loading from 'components/LoadingIcon'
import FilterGroup from 'components/FilterGroup'
import HousesQuery from './queries/index.gql'
import DeleteHouseMutation from './mutations/delete.gql'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'

import { withTranslation } from 'react-i18next'

const actionLinks = (house, togglePopover, t) => (
  <div className={s.actionColumn}>
    <Link to={`/portal/admin/houses/${house.id}/edit`}>{t('volunteer_portal.admin.tab.houses_edit')}</Link>
    <button className={s.deleteAction} onClick={() => togglePopover('destroyHouse', house)}>
      {t('volunteer_portal.admin.tab.houses_delete')}
    </button>
  </div>
)

const columns = (togglePopover, t) => [
  {
    Header: t('volunteer_portal.admin.tab.houses_name'),
    accessor: 'name',
    filterable: true,
  },
  {
    Header: t('volunteer_portal.admin.tab.houses_timezone'),
    accessor: 'timezone',
    sortable: false,
  },
  {
    Header: t('volunteer_portal.admin.tab.houses_actions'),
    accessor: 'id',
    sortable: false,
    width: 130,
    Cell: ({ original }) => actionLinks(original, togglePopover, t),
  },
]

const containerProps = () => ({
  style: {
    border: 'none',
  },
})

const tableProps = () => ({
  style: {
    border: 'none',
  },
})

const theadProps = () => ({
  style: {
    boxShadow: 'none',
  },
})

const thProps = () => ({
  style: {
    border: 'none',
    borderBottom: '2px solid #eee',
    textAlign: 'left',
    padding: '15px 5px',
    boxShadow: 'none',
    fontWeight: 'bold',
  },
})

const trProps = () => ({
  style: {
    border: 'none',
  },
})

const tdProps = () => ({
  style: {
    border: 'none',
    borderBottom: '1px solid #eee',
    padding: 10,
  },
})

const destroyActions = (togglePopover, destroyHousePopover, deleteHouse, t) => [
  <button
    className={`${s.btn} ${s.cancelBtn}`}
    onClick={() => togglePopover('destroyHouse', destroyHousePopover.data)}
  >
    {t('volunteer_portal.admin.tab.houses_delete_cancel')}
  </button>,
  <button
    className={`${s.btn} ${s.deleteBtn}`}
    onClick={() => deleteHouse(destroyHousePopover.data) && togglePopover('destroyHouse')}
  >
    {t('volunteer_portal.admin.tab.houses_delete_delete')}
  </button>,
]

const Houses = ({ data: { networkStatus, houses }, deleteHouse, destroyHousePopover, togglePopover, t }) =>
  networkStatus === NetworkStatus.loading ? (
    <Loading />
  ) : (
    <div>
      <FilterGroup>
        <Link to="/portal/admin/houses/new">
          <Button>{t('volunteer_portal.admin.tab.houses_add_house')}</Button>
        </Link>
      </FilterGroup>
      <ReactTable
        NoDataComponent={() => null}
        data={houses}
        columns={columns(togglePopover, t)}
        minRows={0}
        defaultFilterMethod={defaultFilterMethod}
        getProps={containerProps}
        getTableProps={tableProps}
        getTheadProps={theadProps}
        getTheadThProps={thProps}
        getTrGroupProps={trProps}
        getTrProps={trProps}
        getTdProps={tdProps}
      />
      {destroyHousePopover ? (
        <Dialog
          title={t('volunteer_portal.admin.tab.houses_delete_delete_house')}
          actions={destroyActions(togglePopover, destroyHousePopover, deleteHouse, t)}
          modal={false}
          open
          onRequestClose={() => togglePopover('destroyHouse', destroyHousePopover.data)}
          actionsContainerStyle={{ paddingBottom: 20 }}
        >
          {t('volunteer_portal.admin.tab.houses_delete_confirmation', { house: destroyHousePopover.data.name })}
        </Dialog>
      ) : null}
    </div>
  )

const buildOptimisticResponse = house => ({
  __typename: 'Mutation',
  deleteHouse: {
    __typename: 'House',
    ...house,
  },
})

const withData = compose(
  graphql(HousesQuery, {}),
  graphql(DeleteHouseMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteHouse: house =>
        mutate({
          variables: { id: house.id },
          optimisticResponse: buildOptimisticResponse(house),
          update: (proxy, { data: { deleteHouse } }) => {
            const { houses } = proxy.readQuery({ query: HousesQuery })
            const withHouseRemoved = R.reject(house => house.id === deleteHouse.id, houses)
            proxy.writeQuery({ query: HousesQuery, data: { houses: withHouseRemoved } })
          },
        }).catch(({ graphQLErrors }) => {
          ownProps.graphQLError(graphQLErrors)
        }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => {
  const { popover } = state.model

  return {
    destroyHousePopover: popover && popover.type === 'destroyHouse' ? popover : null,
  }
}

const withActions = connect(mapStateToProps, {
  graphQLError,
  togglePopover,
})

export default withActions(withData(withTranslation()(Houses)))
