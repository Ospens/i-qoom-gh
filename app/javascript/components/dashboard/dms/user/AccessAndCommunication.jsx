import React, { Component } from 'react'
import { Field } from 'redux-form'
import SelectField from '../../../../elements/SelectField'
import CheckboxField from '../../../../elements/CheckboxField'
import InputField from '../../../../elements/InputField'
import DocumentTextEditor from '../../../../elements/DocumentTextEditor'

const ddItems = [
  {
    value: 'STX',
    title: 'STX'
  },
  {
    value: 'EOS',
    title: 'EOS'
  }
]

class AccessAndCommunication extends Component {
  state = {  }

  render() {
    const { submitErrors, orig_company, backStep } = this.props

    return (
      <React.Fragment>
        <div className='dms-content__header p-4'>
          <h4>Access & communication</h4>
        </div>

        <form className='form-body'>
          <div className='p-4'>
            <div className='form-group'>
              <Field
                component={InputField}
                name='email_addresses'
                id='email_addresses'
                placeholder='E-mail'
                label='Enter E-mail addresses*'
              />
            </div>
            <div className='form-group'>
              <Field
                name='сс'
                id='сс'
                options={ddItems}
                errorField={submitErrors}
                component={SelectField}
                isMulti={true}
                placeholder='E-mail'
                label='CC'
              />
            </div>

            <div className='row'>
              <div className='col-6'>
                <div className='form-group'>
                  <Field
                    component={InputField}
                    name='mail_subject'
                    id='mail_subject'
                    label='Mail subject'
                    placeholder='Define a mail subject'
                  />
                </div>
              </div>
              <div className='col-6 subject-like-document'>
                <div className='form-group'>
                  <CheckboxField
                    name='subject_like_document'
                    checkBoxId='subject_like_document'
                    labelClass='form-check-label mr-2'
                    text='Subject like document'
                    errorField={submitErrors}
                  />
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='col-6'>
                <div className='form-group'>
                  <Field
                    name='isssued_for'
                    id='isssued_for'
                    options={ddItems}
                    errorField={submitErrors}
                    component={SelectField}
                    label='Issued for...'
                  />
                </div>
              </div>
              <div className='col-6' />
            </div>

            <div className='row'>
              <div className='col-6'>
                <div className='form-group'>
                  <Field
                    name='select_reviewers'
                    id='select_reviewers'
                    options={ddItems}
                    errorField={submitErrors}
                    component={SelectField}
                    label='Reviewers*'
                    placeholder='Select reviwers'
                  />
                </div>
              </div>
              <div className='col-6'>
                <div className='form-group'>
                  <Field
                    name='isssuers_review'
                    id='isssuers_review'
                    options={ddItems}
                    errorField={submitErrors}
                    component={SelectField}
                    label='Issuers review issuer*'
                    placeholder='Define Issuers review issuer'
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className='form-group'>
            <DocumentTextEditor text='Some text' />
          </div>
        </form>

        <div className='dms-footer'>
          <button type='button' className='btn btn-white' onClick={backStep}>Back</button>
          <button type='button' className='btn btn-white'>Cancel</button>
          <button type='submit' className='btn btn-purple'>Save only</button>
          <button type='submit' className='btn btn-purple'>Save & send</button>
        </div>
      </React.Fragment>
    )
  }
}
 
export default AccessAndCommunication