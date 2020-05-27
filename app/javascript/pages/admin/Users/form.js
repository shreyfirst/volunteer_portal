import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment-timezone'

import UserForm from 'components/UserForm'

import s from './form.css'

const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = 'is required'
  }

  if (!values.location) {
    errors.location = 'is required'
  }

  return errors
}

const UserFormPage = ({ handleSubmit, pristine, submitting, graphQLErrors, houses }) => (
  <UserForm
    handleSubmit={handleSubmit}
    disableSubmit={pristine || submitting}
    errors={graphQLErrors}
    houses={houses}
  />
)

const withReduxForm = reduxForm({
  form: 'user',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { user, houses }) => {
  const props = { graphQLErrors, houses }

  return R.isNil(user) ? props : R.merge({ initialValues: user }, props)
}

const withActions = connect(
  mapStateToProps,
  {}
)

export default withActions(withReduxForm(UserFormPage))
