import axios from 'axios'
import {
  SubmissionError,
  initialize,
  arraySplice,
  arrayMove
} from 'redux-form'
import {
  EDITING_CONVENTION,
  CONVENTION_UPDATED
} from './types'
import { errorNotify, successNotify } from '../elements/Notices'

export const fieldByColumn = data => {
  const fields = data.document_fields
  const sorted = fields.reduce((accumulator, currentValue, index) => {
    accumulator[`column_${currentValue.column}`].push({ ...currentValue, index })
    return accumulator
  }, { column_1: [], column_2: [] })

  sorted.column_1.sort((a, b) => a.row - b.row)
  sorted.column_2.sort((a, b) => a.row - b.row)
  const newData = {
    ...data,
    grouped_fields: {
      ...sorted
    }
  }
  return newData
}

const editingConvention = payload => ({
  type: EDITING_CONVENTION,
  payload
})

const conventionUpdated = payload => ({
  type: CONVENTION_UPDATED,
  payload
})

export const startUpdateConvention = (projectId, values) => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }
  const docFields = []
  Object.keys(values).forEach((k, index) => {
    values[k].forEach((row, i) => {
      const newRow = {
        ...row,
        column: index + 1,
        row: i + 1
      }

      docFields.push(newRow)
    })
  })

  const request = {
    convention: {
      document_fields: docFields
    }
  }

  return (
    axios.put(`/api/v1/projects/${projectId}/conventions/`, request, headers)
      .then(response => {
        const { data } = response
        const sortedData = fieldByColumn(data)
        successNotify('The convention was updated!')
        dispatch(conventionUpdated(sortedData))
        dispatch(initialize('convention_form', sortedData.grouped_fields))
      })
      .catch(err => {
        errorNotify('Something went wrong')
        throw new SubmissionError(err)
      })
  )
}

export const startEditConvention = projectId => (dispatch, getState) => {
  const { user: { token } } = getState()
  const headers = { headers: { Authorization: token } }

  return (
    axios.get(`/api/v1/projects/${projectId}/conventions/edit`, headers)
      .then(response => {
        const { data } = response
        const sortedData = fieldByColumn(data)
        dispatch(editingConvention(sortedData))
        dispatch(initialize('convention_form', sortedData.grouped_fields))
      })
      .catch(() => {
        errorNotify('Something went wrong')
      })
  )
}

export const reorderFields = (result, fields) => dispatch => {
  const { destination, source } = result

  if (!destination) return

  if (
    destination.droppableId === source.droppableId
    && destination.index === source.index
  ) {
    return
  }

  if (source.droppableId === destination.droppableId) {
    dispatch(arrayMove('convention_form', `column_${source.droppableId}`, source.index, destination.index))
    return
  }
  const movingField = fields[`column_${source.droppableId}`][source.index]

  dispatch(arraySplice('convention_form', `column_${source.droppableId}`, source.index, 1))
  dispatch(arraySplice('convention_form', `column_${destination.droppableId}`, destination.index, 0, movingField))
}