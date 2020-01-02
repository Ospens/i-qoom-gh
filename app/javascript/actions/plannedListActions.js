import axios from 'axios'
import { initialize, SubmissionError } from 'redux-form'
import {
  PLANNED_LIST_UPDATED,
  PLANNED_LISTS_FETCHED,
  PLANNED_LIST_FETCHED,
  PLANNED_LIST_ADDED,
  EDIT_PLANNED_LIST
} from './types'
import { errorNotify } from './notificationsActions'

const plannedListUpdated = payload => ({
  type: PLANNED_LIST_UPDATED,
  payload
})

export const fetchPlannedLists = projectId => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { Authorization: token }

  return (
    axios.get(` /api/v1/projects/${projectId}/dms_planned_lists/`, { headers })
      .then(({ data }) => {
        dispatch({ type: PLANNED_LISTS_FETCHED, payload: data })
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}

export const fetchPlannedList = (projectId, listId) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { Authorization: token }

  return (
    axios.get(` /api/v1/projects/${projectId}/dms_planned_lists/${listId}`, { headers })
      .then(({ data }) => {
        dispatch({ type: PLANNED_LIST_FETCHED, payload: data })
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}

export const createPlannedList = (projectId, values) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.post(`/api/v1/projects/${projectId}/dms_planned_lists`,
      { dms_planned_list: values },
      headers)
      .then(({ data }) => {
        dispatch({ type: PLANNED_LIST_ADDED, payload: data })
        dispatch(initialize('planned_list_form', data))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const updatePlannedList = (projectId, values) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.put(`/api/v1/projects/${projectId}/dms_planned_lists/${values.id}`,
      { dms_planned_list: values },
      headers)
      .then(({ data }) => {
        dispatch(initialize('planned_list_form', data))
        dispatch(plannedListUpdated(data))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const updatePlannedListMembers = (projectId, values) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.post(`/api/v1/projects/${projectId}/dms_planned_lists/${values.id}/update_users`,
      { users: values.users },
      headers)
      .then(() => {
        dispatch(plannedListUpdated(values))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const editPlannedListDocuments = (projectId, listId) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/${projectId}/dms_planned_lists/${listId}/edit_documents`,
      headers)
      .then(({ data }) => {
        data.document_mains = data.document_mains.map(doc => ({
          ...doc,
          temp_id: `f${((Math.random() * 1e8)).toString(16)}`
        }))
        dispatch({ type: EDIT_PLANNED_LIST, payload: data })
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

const stringToObjectKeys = params => {
  const data = { document: { document_fields: [] } }
  params.forEach(param => {
    const documentField = param.find(c => c.includes('document_fields['))
    if (documentField) {
      const documentFieldNumber = documentField.match(/\d+/)[0]
      data.document.document_fields[documentFieldNumber] = { value: 'error' }
    }
  })
  return data
}

export const updatePlannedListDocuments = (projectId, listId, request) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }
  return (
    axios.post(`/api/v1/projects/${projectId}/dms_planned_lists/${listId}/update_documents`,
      request,
      headers)
      .then(({ data }) => {
        const errorsFields = data.map(el => Object.entries(el.errors).length === 0
          && el.errors.constructor === Object)
        if (errorsFields.filter(er => !er).length > 0) {
          const errors = { document_mains: [] }
          errors.document_mains = request.document_mains.map(dm => {
            const field = data.find(el => el.temp_id === dm.temp_id)
            if (!field) return {}

            const keysArray = Object.keys(field.errors).map(a => a.split('.'))
            return stringToObjectKeys(keysArray)
          })
          throw errors
        }

        // TODO: part if data is valid
      })
      .catch(response => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response)
      })
  )
}
