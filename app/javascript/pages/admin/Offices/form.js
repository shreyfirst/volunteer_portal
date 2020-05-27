import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import * as R from 'ramda'
import moment from 'moment-timezone'

import HouseForm from 'components/HouseForm'

import s from './form.css'

const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = 'is required'
  }

  if (!values.timezone || values.timezone === '-') {
    errors.timezone = 'is required'
  }

  return errors
}

const HouseFormPage = ({ handleSubmit, pristine, submitting, graphQLErrors }) => (
  <HouseForm handleSubmit={handleSubmit} disableSubmit={pristine || submitting} errors={graphQLErrors} />
)

const withReduxForm = reduxForm({
  form: 'house',
  enableReinitialize: true,
  validate,
})

const mapStateToProps = ({ graphQLErrors }, { house }) => {
  const props = { graphQLErrors }

  return R.isNil(house) ? props : R.merge({ initialValues: house }, props)
}

const withActions = connect(
  mapStateToProps,
  {}
)

export default withActions(withReduxForm(HouseFormPage))
