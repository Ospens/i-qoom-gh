import {
  DOCUMENT_CREATE_SUCCESS,
  DOCUMENT_FETCH_SUCCESS,
  DOCUMENTS_FETCH_SUCCESS,
  EDIT_DOCUMENT,
  REVISIONS_AND_VERSIONS_FETCH__SUCCESS,
  DOCUMENTS_FETCHED_WITHOUT_FILTERS_SUCCESS,
  TOGGLE_FILTERS,
  CREATING_DOCUMENT
} from '../actions/types'

const initialState = {
  allDocuments: [],
  discipline: [],
  originating_companies: [],
  document_types: [],
  revisions: [],
  documentFields: {
    document_fields: [],
    grouped_fields: {
      column_1: [{}],
      column_2: [{}]
    }
  },
  current: {
    document_fields: []
  }
}

const documentsReducer = (state = initialState, action) => {
  switch (action.type) {
  case DOCUMENT_CREATE_SUCCESS:
    return {
      ...state,
      ...action.payload
    }
  case DOCUMENTS_FETCH_SUCCESS:
    return {
      ...state,
      allDocuments: action.payload.documents,
      originating_companies: action.payload.originating_companies.map(oc => ({ title: oc, checked: true })),
      document_types: action.payload.document_types.map(dt => ({ title: dt, checked: true })),
      discipline: action.payload.discipline.map(d => ({ title: d, checked: true })),
    }
  case DOCUMENTS_FETCHED_WITHOUT_FILTERS_SUCCESS:
    return {
      ...state,
      allDocuments: action.payload.documents
    }
  case TOGGLE_FILTERS:
    return {
      ...state,
      [action.payload.type]: state[action.payload.type].map(el => el.title === action.payload.value ? { ...el, checked: !el.checked } : el)
    }
  case DOCUMENT_FETCH_SUCCESS:
    return {
      ...state,
      current: action.payload
    }
  case CREATING_DOCUMENT:
    return {
      ...state,
      documentFields: {
        ...state.documentFields,
        ...action.payload
      }
    }
  case EDIT_DOCUMENT:
    return {
      ...state,
      documentFields: {
        ...state.documentFields,
        ...action.payload
      }
    }
  case REVISIONS_AND_VERSIONS_FETCH__SUCCESS:
    return {
      ...state,
      revisions: action.payload
    }
  default:
    return state
  }
}

export default documentsReducer
