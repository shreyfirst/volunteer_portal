import React from 'react'
import { Field } from 'redux-form'
import moment from 'moment-timezone'
import * as R from 'ramda'
import AutoComplete from 'material-ui/AutoComplete'

import Callout from 'components/Callout'

import s from './main.css'
import { withTranslation } from 'react-i18next'

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const formatGraphQLErrors = errors =>
  R.map(
    ([field, errors]) => (
      <span key={`${field}-error`}>
        <strong>{capitalize(field)}</strong>: {errors.join(', ')}
        <br />
      </span>
    ),
    R.toPairs(errors)
  )

const renderFieldHelper = ({ input, type, label, className, selectOptions }) => {
  switch (type) {
    case 'input':
    case 'text':
      return <input {...input} type={type} className={className} />
    case 'select':
      return (
        <select {...input} className={className}>
          {selectOptions}
        </select>
      )
    default:
      return <Callout type="error" />
  }
}

const renderField = props => {
  const {
    input,
    label,
    type,
    Custom,
    meta: { touched, error, warning },
    className,
    required,
  } = props
  const fieldInput = renderFieldHelper({ input, type, label, className, selectOptions: props.children })
  return (
    <div>
      <label className={s.label}>
        {label} <span className={s.errorMsg}>{touched && error ? error : '*'}</span>
      </label>
      <div>{Custom ? <Custom {...props} /> : fieldInput}</div>
    </div>
  )
}

const isNoErrors = errors => R.isNil(errors) || R.isEmpty(errors)

const HouseForm = ({ handleSubmit, disableSubmit, errors, t }) => (
  <form className={s.form} onSubmit={handleSubmit}>
    {isNoErrors(errors) ? null : <Callout type="error" message={formatGraphQLErrors(errors)} />}
    <div className={s.inputGroup}>
      <Field
        label={t('volunteer_portal.admin.tab.houses_addhouse_name')}
        className={s.field}
        name="name"
        component={renderField}
        type="text"
      />
    </div>
    <div className={s.inputGroup}>
      <Field
        label={t('volunteer_portal.admin.tab.houses_addhouse_timezone')}
        className={s.field}
        name="timezone"
        component={renderField}
        type="select"
      >
        <option value="-" key="-">
          {t('volunteer_portal.admin.tab.houses_addhouse_selecttimezone')}
        </option>
        {R.map(
          zone => (
            <option value={zone} key={zone}>
              {zone}
            </option>
          ),
          moment.tz.names()
        )}
      </Field>
    </div>
    <div className={s.inputGroup}>
      <button className={`${s.btn} ${s.primary}`} type="submit" disabled={disableSubmit}>
        {t('volunteer_portal.admin.tab.houses_addhouse_save')}
      </button>
    </div>
  </form>
)

export default withTranslation()(HouseForm)
