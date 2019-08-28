import axios from 'axios'
import { SubmissionError } from 'redux-form'
import {
  ACTIVE_MEMBERS_FETCHED_SUCCESS,
  PENDING_MEMBERS_FETCHED_SUCCESS,
  PROJECT_MEMBER_CREATED,
  PROJECT_MEMBER_UPDATED,
  CREATING_PROJECT_MEMBER
} from './types'
import { errorNotify } from '../elements/Notices'

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

const updateProjectMember = payload => ({
  type: PROJECT_MEMBER_UPDATED,
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
        errorNotify('Something went wrong')
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
        errorNotify('Something went wrong')
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
        errorNotify('Something went wrong')
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
        dispatch(startFetchActiveProjectMembers(projectId))
      })
      .catch(response => {
        errorNotify('Something went wrong')
        throw new SubmissionError(response.data)
      })
  )
}

export const startUpdateProjectMember = (values, projectId) => (dispatch, getState) => {
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
        dispatch(updateProjectMember(response.data))
      })
      .catch(response => {
        errorNotify('Something went wrong')
        throw new SubmissionError(response.data)
      })
  )
}