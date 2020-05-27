import React, { useState } from 'react'
import * as R from 'ramda'
import moment from 'moment'

import CheckCircleIcon from '@zendeskgarden/svg-icons/src/16/check-circle-stroke.svg'
import InfoIcon from '@zendeskgarden/svg-icons/src/16/info-stroke.svg'
import XCircleIcon from '@zendeskgarden/svg-icons/src/16/x-circle-stroke.svg'
import ReactTable from 'react-table'

import { Modal, Close } from '@zendeskgarden/react-modals'
import { Button } from '@zendeskgarden/react-buttons'

import CreateEditModalContents from './CreateEditModalContents'
import DeleteModalContents from './DeleteModalContents'
import { NoEventsMessage, EventsTable } from './StyledComponents'

import styled from 'styled-components'

const ApprovedIcon = styled(CheckCircleIcon)`
  color: ${({theme}) => theme.palette.lime["400"]};
`

const PendingIcon = styled(InfoIcon)`
  color: ${({theme}) => theme.palette.lemon["400"]};
`

const RejectedIcon = styled(XCircleIcon)`
  color: ${({theme}) => theme.palette.red["400"]};
`

const eventStatusIcon = event => {
  switch (event.status) {
    case 'REJECTED':
      return <RejectedIcon/>
    case 'PENDING':
      return <PendingIcon/>
    case 'APPROVED':
      return <ApprovedIcon/>
    default:
      return <PendingIcon/>
  }
}

const TableButton = styled(Button)`
  padding: 0 ${({theme}) => theme.space.xs};
  line-height: 0px;
  height: 17px;
`

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: 0;
`

const ActionColumn = styled.span`
  white-space: nowrap;
`

const PersonalHeader = styled.div`
  position: relative;
`

const IndividualEvents = props => {
  const { data, popover, createEditIndividualEvent, deleteIndividualEvent } = props

  const { currentUser, houses, eventTypes, organizations, tags } = data

  const [showCreateEditModal, setShowCreateEditModal] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [modalEventData, setModalEventData] = useState()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(false)

  const noIndividualEventsMessage = (
    <NoEventsMessage>
      Looks like there are no individual events here. Volunteer and record your first event.
    </NoEventsMessage>
  )

  const individualEventsColumns = [
    {
      id: 'description',
      Header: 'Description',
      accessor: 'description',
    },
    {
      id: 'organization',
      Header: 'Organization',
      accessor: 'organization.name',
    },
    {
      id: 'date',
      Header: 'Date',
      Cell: props => <span>{moment(props.value).format('MMMM D, YYYY')}</span>,
      accessor: 'date',
    },
    {
      id: 'duration',
      Header: 'Duration (min)',
      accessor: 'duration',
    },
    {
      id: 'type',
      Header: 'Type',
      accessor: 'eventType.title',
    },
    {
      id: 'approval',
      Header: 'Approval',
      accessor: d => eventStatusIcon(d),
      width: 75,
      style: { textAlign: 'center' },
    },
    {
      id: 'actions',
      Header: 'Actions',
      accessor: d => d,
      sortable: false,
      width: 180,
      Cell: props => (
        <ActionColumn>
          <TableButton
            isBasic
            onClick={() => {
              const { id, description, house, date, duration, eventType, tags, organization } = props.value
              setIsNew(false)
              setModalEventData({
                id,
                description,
                house: house.id,
                date: new Date(date),
                duration,
                eventType: eventType.id,
                tags: R.map(R.pick(['id']), tags),
                organization: organization.id,
              })
              setShowCreateEditModal(true)
            }}
          >
            Edit
          </TableButton>
          <TableButton
            isBasic
            onClick={() => {
              const { description, house, date, duration, eventType, tags, organization } = props.value
              setIsNew(true)
              setModalEventData({
                description,
                house: house.id,
                date: new Date(date),
                duration,
                eventType: eventType.id,
                tags: R.map(R.pick(['id']), tags),
                organization: organization.id,
              })
              setShowCreateEditModal(true)
            }}
          >
            Clone
          </TableButton>
          <TableButton
            isBasic
            isDanger
            onClick={() => {
              setToDelete(props.value)
              setShowDeleteModal(true)
            }}
          >
            Delete
          </TableButton>
        </ActionColumn>
      ),
    },
  ]

  return (
    <EventsTable>
      <PersonalHeader>
        <ActionBar>
          <Button
            onClick={() => {
              setIsNew(true)
              setModalEventData()
              setShowCreateEditModal(true)
            }}
          >
            Record Event
          </Button>
        </ActionBar>
        <h1>Individual Events</h1>
        <h4>Private events that you've attended and want to record.</h4>
      </PersonalHeader>
      {currentUser.individualEvents.length === 0 ? (
        noIndividualEventsMessage
      ) : (
        <ReactTable
          NoDataComponent={() => null}
          data={currentUser.individualEvents}
          columns={individualEventsColumns}
          defaultPageSize={10}
          defaultSorted={[{ id: 'date', desc: true }]}
          minRows={0}
        />
      )}
      {showCreateEditModal && (
        <Modal
          onClose={() => {
            setShowCreateEditModal(false)
            setModalEventData()
          }}
        >
          <CreateEditModalContents
            houses={houses}
            eventTypes={eventTypes}
            tags={tags}
            organizations={organizations}
            popover={popover}
            createEditIndividualEvent={createEditIndividualEvent}
            setShowCreateEditModal={setShowCreateEditModal}
            isNew={isNew}
            modalEventData={modalEventData}
          />
          <Close aria-label="Close modal" />
        </Modal>
      )}
      {showDeleteModal && (
        <Modal
          onClose={() => {
            setShowDeleteModal(false)
            setToDelete()
          }}
        >
          <DeleteModalContents
            toDelete={toDelete}
            deleteIndividualEvent={deleteIndividualEvent}
            setShowDeleteModal={setShowDeleteModal}
          />
          <Close aria-label="Close modal" />
        </Modal>
      )}
    </EventsTable>
  )
}
export default IndividualEvents
