import axios from 'axios'
import {
  SubmissionError,
  initialize
} from 'redux-form'
import {
  DELETE_MEMBERS,
  ACTIVE_MEMBERS_FETCHED_SUCCESS,
  ACTIVE_MEMBERS_UPDATED,
  PENDING_MEMBERS_UPDATED,
  PENDING_MEMBERS_FETCHED_SUCCESS,
  PROJECT_MEMBER_CREATED,
  CREATING_PROJECT_MEMBER,
  PROJECT_MEMBER_UPDATED
} from './types'
import { errorNotify, successNotify } from './notificationsActions'
import {
  CREATING_MEMBER,
  ACTIVE_MEMBERS,
  PENDING_MEMBERS,
  EDITING_MEMBER
} from '../components/dashboard/projectSettings/memberManagment/membersTypes'

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
        dispatch(errorNotify('Problem'))
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
        dispatch(errorNotify('Problem'))
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
        dispatch(errorNotify('Problem'))
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
        dispatch(initialize('project_member_form', response.data))
      })
      .catch(response => {
        dispatch(errorNotify('Problem'))
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
        if (type === ACTIVE_MEMBERS) {
          dispatch(updateActiveMembers(response.data))
        } else if (type === PENDING_MEMBERS) {
          dispatch(updatePendingMembers(response.data))
        } else if (type === EDITING_MEMBER) {
          dispatch({ type: PROJECT_MEMBER_UPDATED, payload: response.data })
          dispatch(initialize('project_member_form', response.data))
        } else if (response.data.creation_step === 'pending' && type === CREATING_MEMBER) {
          dispatch(createProjectMember(response.data))
        } else if (type === CREATING_MEMBER) {
          dispatch(initialize('project_member_form', response.data))
        }
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
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
          dispatch(successNotify('System', 'You successfully accepted the invite!'))
        }
        return response
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          const text = response.data && response.data.token
            ? response.data.token.map(p => p.replace('problem:', '')).join(',')
            : 'Something went wrong!'
          dispatch(errorNotify('Problem', text))
        } else if (response.status === 401) {
          localStorage.setItem('newUserToken', memberToken)
          const text = response.data && response.data.token
            ? response.data.token.map(p => p.replace('problem:', '')).join(',')
            : 'Please login with the correct memberID'
          dispatch(errorNotify('Problem', text))
        }
        return response
      })
  )
}

export const deleteMembers = (projectId, memberIds) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.post(`/api/v1/projects/${projectId}/members/delete`,
      { project_member_ids: memberIds },
      headers)
      .then(() => {
        dispatch({ type: DELETE_MEMBERS, payload: memberIds })
        dispatch(successNotify('Projects', 'The members were deleted!'))
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}
