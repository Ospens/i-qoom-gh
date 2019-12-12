import axios from 'axios'
import {
  SubmissionError,
  initialize
} from 'redux-form'
import {
  ACTIVE_MEMBERS_FETCHED_SUCCESS,
  ACTIVE_MEMBERS_UPDATED,
  PENDING_MEMBERS_UPDATED,
  PENDING_MEMBERS_FETCHED_SUCCESS,
  PROJECT_MEMBER_CREATED,
  CREATING_PROJECT_MEMBER
} from './types'
import { addNotification } from './notificationsActions'

const projectMembersFetched = payload => ({
  type: ACTIVE_MEMBERS_FETCHED_SUCCESS,
  payload
})

const pendingMembersFetched = payload => ({
  type: PENDING_MEMBERS_FETCHED_SUCCESS,
  payload
})

const projectMemberCreating = payload => ({
  type: CREATING_PROJECT_MEMBER,
  payload
})

const createProjectMember = payload => ({
  type: PROJECT_MEMBER_CREATED,
  payload
})

const updateActiveMembers = payload => ({
  type: ACTIVE_MEMBERS_UPDATED,
  payload
})

const updatePendingMembers = payload => ({
  type: PENDING_MEMBERS_UPDATED,
  payload
})

export const startFetchActiveProjectMembers = id => (dispatch, getState) => {
  const { token } = getState().user
  const headers = { headers: { Authorization: token } }
  return (
    axios.get(`/api/v1/projects/${id}/members/active`, headers)
      .then(response => {
        dispatch(projectMembersFetched({ ...response.data }))
      })
      .catch(() => {
        dispatch(addNotification({ title: 'Problem', text: 'Something went wrong!', type: 'error' }, true))
      })
  )
}

export const startFetchPendingProjectMembers = id => (dispatch, getState) => {
  const { token } = getState().user
  const headers = { headers: { Authorization: token } }
  return (
    axios.get(`/api/v1/projects/${id}/members/pending`, headers)
      .then(response => {
        dispatch(pendingMembersFetched({ ...response.data }))
      })
      .catch(() => {
        dispatch(addNotification({ title: 'Problem', text: 'Something went wrong!', type: 'error' }, true))
      })
  )
}

export const startCreatingProjectMember = id => (dispatch, getState) => {
  const { token } = getState().user
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/${id}/members/new`, headers)
      .then(response => {
        dispatch(projectMemberCreating(response.data))
      })
      .catch(() => {
        dispatch(addNotification({ title: 'Problem', text: 'Something went wrong!', type: 'error' }, true))
      })
  )
}

export const startCreateProjectMember = (values, projectId) => (dispatch, getState) => {
  const { token } = getState().user
  const headers = { headers: { Authorization: token } }

  const request = {
    project_member: {
      ...values
    }
  }
  return (
    axios.post(`/api/v1/projects/${projectId}/members/`, request, headers)
      .then(response => {
        dispatch(createProjectMember(response.data))
        // dispatch(startFetchActiveProjectMembers(projectId))
        dispatch(initialize('project_member_form', response.data))
      })
      .catch(response => {
        dispatch(addNotification({ title: 'Problem', text: 'Something went wrong!', type: 'error' }, true))
        throw new SubmissionError(response.data)
      })
  )
}

export const startUpdateProjectMember = (values, projectId, type) => (dispatch, getState) => {
  const { token } = getState().user
  const headers = { headers: { Authorization: token } }

  const request = {
    project_member: {
      ...values
    }
  }

  return (
    axios.patch(`/api/v1/projects/${projectId}/members/${values.id}`, request, headers)
      .then(response => {
        if (type === 'activeMembers') {
          dispatch(updateActiveMembers(response.data))
        } else if (type === 'pendingMemebers') {
          dispatch(updatePendingMembers(response.data))
        } else if (type === 'creating') {
          dispatch(initialize('project_member_form', response.data))
        }
      })
      .catch(response => {
        dispatch(addNotification({ title: 'Problem', text: 'Something went wrong!', type: 'error' }, true))
        throw new SubmissionError(response.data)
      })
  )
}

export const startConfirmMember = memberToken => (dispatch, getState) => {
  const { token } = getState().user
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/confirm_member?token=${memberToken}`, headers)
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem('newUserToken')
          dispatch(addNotification(
            { title: 'System', text: 'You successfully accepted the invite!', type: 'success' }
          ))
        }
        return response
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          const text = response.data && response.data.token
            ? response.data.token.map(p => p.replace('problem:', '')).join(',')
            : 'Something went wrong!'
          dispatch(addNotification({ title: 'Problem', text, type: 'error' }, true))
        } else if (response.status === 401) {
          localStorage.setItem('newUserToken', memberToken)
          const text = response.data && response.data.token
            ? response.data.token.map(p => p.replace('problem:', '')).join(',')
            : 'Please login with the correct memberID'
          dispatch(addNotification({ title: 'System', text, type: 'error' }))
        }
        return response
      })
  )
}
