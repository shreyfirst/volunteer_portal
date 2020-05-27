import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'

import EventForm from 'components/EventForm'
import moment from 'moment'

const validate = values => {
  const errors = {}

  if (!values.title) {
    errors.title = 'is required'
  }
  if (!values.description) {
    errors.description = 'is required'
  }
  if (!values.tags || values.tags.length < 1) {
    errors.tags = {}
    errors.tags = 'is required'
  }
  if (!values.eventType) {
    errors.eventType = {}
    errors.eventType.id = 'is required'
  }
  if (!values.organization) {
    errors.organization = {}
    errors.organization.id = 'is required'
  }
  if (!values.house) {
    errors.house = {}
    errors.house.id = 'is required'
  }
  if (!values.location) {
    errors.location = 'is required'
  }
  if (!values.startsAt) {
    errors.startsAt = 'is required'
  }
  if (!values.endsAt) {
    errors.endsAt = 'is required'
  }
  if (moment(values.endsAt).isBefore(moment(values.startsAt))) {
    errors.endsAt = 'is ending before it started'
  }
  if (!values.capacity || Number(values.capacity) === NaN) {
    errors.capacity = 'is required and must be a number'
  }

  return errors
}

const EventFormPage = ({
  eventTypes,
  tags,
  houses,
  organizations,
  handleSubmit,
  pristine,
  submitting,
  graphQLErrors,
  children,
}) => (
  <EventForm
    eventTypes={eventTypes}
    tags={tags}
    houses={houses}
    organizations={organizations}
    handleSubmit={handleSubmit}
    disableSubmit={pristine || submitting}
    errors={graphQLErrors}
  >
    {children}
  </EventForm>
)

const withReduxForm = reduxForm({
  form: 'event',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { event }) => {
  const props = { graphQLErrors }
  return R.isNil(event) ? props : R.merge({ initialValues: event }, props)
}

const withActions = connect(
  mapStateToProps,
  {}
)

export default withActions(withReduxForm(EventFormPage))
