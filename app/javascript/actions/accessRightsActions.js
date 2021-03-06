import axios from 'axios'
import { SubmissionError, initialize } from 'redux-form'
import {
  GET_CURRENT_MEMBER,
  DELETE_TEAM,
  // UPDATE_NEW_TEAMS_LIST,
  // UPDATE_OLD_TEAMS_LIST,
  GET_NEW_TEAMS_LIST,
  GET_OLD_TEAMS_LIST,
  GET_NEW_MEMBERS_LIST,
  GET_CURRENT_MEMBERS_LIST,
  UPDATE_TEAM_MEMBERS
} from './types'
import { errorNotify, successNotify } from './notificationsActions'

const teamDeleted = payload => ({
  type: DELETE_TEAM,
  payload
})
/*

const updateNewTeams = payload => ({
  type: UPDATE_NEW_TEAMS_LIST,
  payload
})
*/

const teamMembersUpdated = payload => ({
  type: UPDATE_TEAM_MEMBERS,
  payload
})
/*

const updateOldTeams = payload => ({
  type: UPDATE_OLD_TEAMS_LIST,
  payload
})
*/

const teamsFetched = payload => ({
  type: GET_OLD_TEAMS_LIST,
  payload
})

const newTeamsFetched = payload => ({
  type: GET_NEW_TEAMS_LIST,
  payload
})

const newMembersFetched = payload => ({
  type: GET_NEW_MEMBERS_LIST,
  payload
})

const currentMembersFetched = payload => ({
  type: GET_CURRENT_MEMBERS_LIST,
  payload
})

const memberFetched = payload => ({
  type: GET_CURRENT_MEMBER,
  payload
})

export const getTeams = (projectId, isNew = false) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/${projectId}/dms_teams?only_new=${isNew}`, headers)
      .then(({ data }) => {
        if (isNew) {
          dispatch(newTeamsFetched(data))
        } else {
          dispatch(teamsFetched(data))
        }
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}

export const createTeam = (projectId, request) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.post(`/api/v1/projects/${projectId}/dms_teams?name=${request.name}`, {}, headers)
      .then(({ data }) => {
        dispatch(initialize('team_form', data))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const updateTeam = (projectId, request) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.put(`/api/v1/projects/${projectId}/dms_teams/${request.id}?name=${request.name}`, {}, headers)
      .then(({ data }) => {
        dispatch(initialize('team_form', data))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const deleteTeam = (projectId, teamIds) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { Authorization: token }
  const data = { dms_teams: teamIds }

  return (
    axios.delete(`/api/v1/projects/${projectId}/dms_teams/`, { data, headers })
      .then(() => {
        dispatch(teamDeleted({ teamIds }))
        dispatch(successNotify('Teams', 'Team(s) was deleted!'))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const updateTeamMembers = (projectId, values) => (dispatch, getState) => {
  const { user: { token }, accessRights: { oldTeams, newTeams } } = getState()
  const headers = { headers: { Authorization: token } }
  const request = {
    ...values
  }

  return (
    axios.post(`/api/v1/projects/${projectId}/dms_teams/${values.id}/update_members`, request, headers)
      .then(({ data }) => {
        const type = oldTeams.findIndex(t => t.id === data.id) > -1 ? 'oldTeams' : 'newTeams'
        let value = {}
        if (type === 'oldTeams') {
          value = { oldTeams: oldTeams.map(t => (t.id === data.id ? data : t)) }
        } else {
          value = { newTeams: newTeams.map(t => (t.id === data.id ? data : t)) }
        }
        dispatch(teamMembersUpdated(value))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const deleteTeamMembers = (projectId, teamId, userId) => (dispatch, getState) => {
  const { accessRights: { oldTeams, newTeams } } = getState()
  const team = oldTeams.concat(newTeams).find(({ id }) => id === teamId)
  team.users = team.users.filter(({ id }) => id !== userId)
  const values = {
    id: teamId,
    users: team.users.filter(({ id }) => id !== userId)
  }
  dispatch(updateTeamMembers(projectId, values))
}

export const updateTeamRights = (projectId, teams) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }
  const request = { teams }
  return (
    axios.post(`/api/v1/projects/${projectId}/dms_teams//update_rights`, request, headers)
      .then(() => {
        dispatch(getTeams(projectId))
        dispatch(getTeams(projectId, true))
        dispatch(successNotify('Teams', 'Access rights changed!'))
      })
      .catch(({ response }) => {
        dispatch(errorNotify('Problem'))
        throw new SubmissionError(response.data)
      })
  )
}

export const getGrantAccessMembers = projectId => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/${projectId}/document_rights/new`, headers)
      .then(response => {
        dispatch(newMembersFetched(response.data))
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}

export const getGrandedAccessMembers = projectId => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/${projectId}/document_rights/edit`, headers)
      .then(response => {
        dispatch(currentMembersFetched(response.data))
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}

export const startUpdateAccessMembers = (projectId, values, type) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }
  const request = { users: [values] }

  return (
    axios.put(`/api/v1/projects/${projectId}/document_rights/`, request, headers)
      .then(() => {
        if (type === 'newMembers') {
          dispatch(getGrantAccessMembers(projectId))
        } else if (type === 'oldMembers') {
          dispatch(getGrandedAccessMembers(projectId))
        }
        dispatch(successNotify('Access rights', 'Rights successfully updated'))
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}

export const showMemberProfile = (projectId, memberId) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/${projectId}/documents/members/${memberId}`, headers)
      .then(({ data }) => {
        dispatch(memberFetched(data))
      })
      .catch(() => {
        dispatch(errorNotify('Problem'))
      })
  )
}
