import React from 'react'
import HouseForm from './'
import renderer from 'react-test-renderer'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reduxForm } from 'redux-form'
import { Provider } from 'react-redux'

const rootReducer = combineReducers({ form: formReducer })
const store = createStore(rootReducer)
const WithReduxForm = reduxForm({ form: 'test-house' })(HouseForm)

const handleSubmit = () => {}

test('loads', () => {
  const component = renderer.create(
    <Provider store={store}>
      <WithReduxForm handleSubmit={handleSubmit} disableSumbit={false} />
    </Provider>
  )
  const tree = component.toJSON()

  expect(tree).toMatchSnapshot()
})
