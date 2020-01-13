import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  formValueSelector,
  Field,
  change,
  touch
} from 'redux-form'
import DocIdModal from '../../DocIdModal'
import SelectField from '../../../../../elements/SelectField'
import DatePickerField from '../../../../../elements/DatePickerField'
import DropZoneField from '../../../../../elements/DropZoneField'
import InputField from '../../../../../elements/InputField'
import TextAreaField from '../../../../../elements/TextAreaField'
import {
  required, maxLength4, maxLength2, minLength2, minLength4
} from '../../../../../elements/validations'

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
  field, modal, toggleModal, changeValues, fieldIndex, editable
}) {
  const dispatch = useDispatch()
  const conventionId = useSelector(state => selector(state, 'convention_id'))
  const uniqName = `document_fields[${fieldIndex}].value`
  const disabled = !editable && conventionId && codificationString.includes(field.codification_kind)

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

export default InputByType
