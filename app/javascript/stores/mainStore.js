import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  reducer as reduxFormReducer
} from 'redux-form'
import thunk from 'redux-thunk'
import authReducer from '../reducers/authReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  form: reduxFormReducer
})

export default createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)