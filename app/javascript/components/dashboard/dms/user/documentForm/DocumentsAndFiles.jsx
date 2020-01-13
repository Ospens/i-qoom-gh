import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import {
  formValueSelector,
  Field,
  change,
  touch,
  initialize
} from 'redux-form'
import { Link, withRouter } from 'react-router-dom'
import DocIdModal from '../../DocIdModal'
import SelectField from '../../../../../elements/SelectField'
import DatePickerField from '../../../../../elements/DatePickerField'
import DropZoneField from '../../../../../elements/DropZoneField'
import InputField from '../../../../../elements/InputField'
import TextAreaField from '../../../../../elements/TextAreaField'
import {
  required, maxLength4, maxLength2, minLength2, minLength4
} from '../../../../../elements/validations'
import { initValues } from '../../initDocId'
import DocumentIdInputs from '../../DocumentIdInputs'
import { infoNotify } from '../../../../../actions/notificationsActions'
import CheckBoxField from '../../../../../elements/CheckBoxField'

const codificationString = [
  'originating_company',
  'discipline',
  'document_type',
  'revision_number',
  'document_number'
]

const selector = formValueSelector('document_form')

const validationList = field => {
  const list = []
  if (field.required) {
    list.push(required)
  }
  if (field.codification_kind === 'document_number') {
    list.push(maxLength4, minLength4)
  }
  if (field.codification_kind === 'revision_number') {
    list.push(maxLength2, minLength2)
  }
  return list
}

function InputByType({
  field, modal, toggleModal, changeValues, fieldIndex
}) {
  const dispatch = useDispatch()
  const conventionId = useSelector(state => selector(state, 'convention_id'))
  const uniqName = `document_fields[${fieldIndex}].value`
  const disabled = conventionId && codificationString.includes(field.codification_kind)

  const blurPadStart = useCallback((index, padStart, event) => {
    event.preventDefault()
    const newValue = String(event.target.value).padStart(padStart, 0)
    dispatch(change('document_form', `document_fields[${index}].value`, newValue))
    dispatch(touch('document_form', `document_fields[${index}].value`))
  }, [dispatch])

  const commonProps = {
    label: field.title,
    name: uniqName,
    id: uniqName,
    validate: validationList(field),
    placeholder: field.command,
    disabled
  }
  if (field.codification_kind === 'document_number') {
    commonProps.onBlur = v => blurPadStart(fieldIndex, 4, v)
  }
  if (field.codification_kind === 'revision_number') {
    commonProps.onBlur = v => blurPadStart(fieldIndex, 2, v)
  }

  if (field.kind === 'upload_field' && field.codification_kind === 'document_native_file') {
    return (
      <React.Fragment>
        {modal && <DocIdModal toggleModal={toggleModal} open={modal} />}
        <Field
          {...commonProps}
          component={DropZoneField}
          filename={field.filename}
          name={`document_fields[${fieldIndex}].file`}
          id={`document_fields[${fieldIndex}].file`}
        />
      </React.Fragment>
    )
  } if (field.kind === 'upload_field') {
    return (
      <Field
        {...commonProps}
        component={DropZoneField}
        filename={field.filename}
        name={`document_fields[${fieldIndex}].file`}
        id={`document_fields[${fieldIndex}].file`}
      />
    )
  } if (field.kind === 'select_field') {
    const fieldValues = field.document_field_values

    return (
      <Field
        {...commonProps}
        component={SelectField}
        options={fieldValues}
        onChange={v => changeValues(v, fieldValues, fieldIndex)}
      />
    )
  } if (field.kind === 'textarea_field') {
    return (
      <Field
        {...commonProps}
        component={TextAreaField}
      />
    )
  } if (field.kind === 'date_field') {
    return (
      <Field
        {...commonProps}
        component={DatePickerField}
      />
    )
  }
  return (
    <Field
      {...commonProps}
      type={['document_number', 'revision_number']
        .includes(field.codification_kind) ? 'number' : 'text'}
      component={InputField}
    />
  )
}

export const formvalue = (fields = [], codKind) => {
  if (fields.length < 1) return ''

  const field = fields.filter(values => values.codification_kind === codKind)[0]
  if (!field) return ''

  if (codKind === 'document_native_file') return field.file

  return field.value
}

function DocumentsAndFiles({ match: { params: { projectId } } }) {
  const [modal, toggleModal] = useState(false)
  const [prevInfo, setPrevInfo] = useState(false)
  const {
    grouped_fields: groupedFields,
    additional_information: additionalInformation
  } = useSelector(state => state.documents.current)
  const documentFields = useSelector(state => selector(state, 'document_fields')) || []

  const origCompanyValue = formvalue(documentFields, 'originating_company')
  const disciplineValue = formvalue(documentFields, 'discipline')
  const docTypeValue = formvalue(documentFields, 'document_type')
  const docNumberValue = formvalue(documentFields, 'document_number')
  const docFile = formvalue(documentFields, 'document_native_file')
  const generateId = useSelector(state => selector(state, 'generate_id'))
  const columns = Object.keys(groupedFields)
  const dispatch = useDispatch()

  // Select options haven't ids

  const changeValues = useCallback((value, fieldValues, index) => {
    const newValues = fieldValues.map(field => {
      const selected = field.value === value
      return {
        ...field,
        selected
      }
    })
    dispatch(change('document_form', `document_fields[${index}].document_field_values`, newValues))
  }, [dispatch])

  const initDocIdForm = useCallback(values => {
    dispatch(initialize('doc_id_form', values))
  }, [dispatch])

  useEffect(() => {
    if (modal) {
      toggleModal(false)
      return
    }
    if (!generateId) return

    const infoMsg = title => dispatch(
      infoNotify('Documents', `Can not get data from title ${title}`)
    )

    const values = initValues(documentFields, title => infoMsg(title))
    if (!values) return

    initDocIdForm(values)
    toggleModal(true)
  }, [dispatch, docFile, documentFields, generateId, initDocIdForm, modal])
  const additionalInformationIndex = documentFields
    .findIndex(f => f.codification_kind === 'additional_information')
  const nativeFileIndex = documentFields
    .findIndex(f => f.codification_kind === 'document_native_file')

  return (
    <React.Fragment>
      <div className="dms-content__header">
        <h4>Add documents data & files</h4>
        <div className="dms-content__project-phases">
          <span>Project phases</span>
          <ul className="row mx-0">
            <li className="col-3 active">
              <button type="button">
                Planning
              </button>
            </li>
            <li className="col-3">
              <button type="button">
                Development
              </button>
            </li>
            <li className="col-3">
              <button type="button">
                Execution
              </button>
            </li>
            <li className="col-3">
              <button type="button">
                Operation
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="form-body">
        <div className="row new-document-table">

          <div className="col-6">
            <DocumentIdInputs
              origCompanyValue={origCompanyValue}
              disciplineValue={disciplineValue}
              docTypeValue={docTypeValue}
              docNumberValue={docNumberValue}
            />
            <div className="form-group">
              <Field
                component={CheckBoxField}
                id="generate_id"
                name="generate_id"
                labelClass="form-check-label mr-2"
                text="Generate Document ID through file code"
                className="d-flex justify-content-center"
              />
            </div>
            {groupedFields[columns[0]].map(field => {
              if ([additionalInformationIndex, nativeFileIndex].includes(field.index)) {
                return <div key={field.index} />
              }
              return (
                <div className="form-group" key={field.index}>
                  <InputByType
                    modal={modal}
                    toggleModal={toggleModal}
                    field={field}
                    changeValues={changeValues}
                    fieldIndex={field.index}
                  />
                </div>
              )
            })}

          </div>

          <div className="col-6">
            <Field
              component={InputField}
              name="title"
              id="title"
              label="Define a document title"
              placeholder="Title"
              className="form-group"
              validate={[required]}
            />
            {groupedFields[columns[1]].map(field => {
              if ([additionalInformationIndex, nativeFileIndex].includes(field.index)) {
                return <div key={field.index} />
              }
              return (
                <div className="form-group" key={field.index}>
                  <InputByType
                    modal={modal}
                    toggleModal={toggleModal}
                    field={field}
                    changeValues={changeValues}
                    fieldIndex={field.index}
                  />
                </div>
              )
            })}
          </div>
        </div>
        {additionalInformationIndex > -1 && (
          <div className="form-group additional-information">
            <div className={classnames('collapsible-block', { opened: prevInfo })}>
              <button
                type="button"
                className="collapsible__button mb-4"
                onClick={() => setPrevInfo(!prevInfo)}
              >
                <span>Show previous statements</span>
                <span className="arrow-icon icon-arrow-button-down" />
              </button>
              <CSSTransition
                unmountOnExit
                in={prevInfo}
                timeout={300}
                classNames="collapsible__content"
              >
                <div className="collapsible__content">
                  {additionalInformation.map(({ min, max, value }) => {
                    const number = min === max ? max : `${min} - ${max}`
                    return (
                      <div className="mb-4" key={number}>
                        <div className="lightgrey mb-4">{`Revision ${number}`}</div>
                        <div>{value}</div>
                      </div>
                    )
                  })}
                </div>
              </CSSTransition>
            </div>
            <InputByType
              modal={modal}
              toggleModal={toggleModal}
              field={documentFields[additionalInformationIndex]}
              fieldIndex={additionalInformationIndex}
              changeValues={changeValues}
            />
          </div>
        )}
        {nativeFileIndex > -1 && (
          <div className="col-6 pl-0">
            <div className="form-group">
              <InputByType
                modal={modal}
                toggleModal={toggleModal}
                field={documentFields[nativeFileIndex]}
                fieldIndex={nativeFileIndex}
                changeValues={changeValues}
              />
            </div>
          </div>
        )}
      </div>
      <div className="dms-footer">
        <Link className="btn btn-white" to={`/dashboard/projects/${projectId}/documents/`}>
          Cancel
        </Link>
        <button type="submit" className="btn btn-purple">Next</button>
      </div>
    </React.Fragment>
  )
}

export default withRouter(DocumentsAndFiles)
