import React, { useState, useEffect } from 'react'
import AdministratorFields from '../../../elements/forms/AdministratorFields'

function renderSubmitButtons(secondAdmin, { closeModal, backStep }) {
  return (
    <div className='new-modal__footer'>
      <button type='button' className='btn btn-back' onClick={() => backStep(secondAdmin ? '' : 'admins[1]')}>
        <span className='icon-arrow-button-left' />
        Back
      </button>
      <button
        type='button'
        className='btn btn-white'
        onClick={closeModal}
      >
        Cancel
      </button>
      <button type='submit' className='btn btn-purple'>
        {secondAdmin ? 'Next' : 'Skip'}
      </button>
    </div>
  )
}

function SecondAdmin({ adminCreated, ...props }) {
  const [secondAdmin, togglesecondAdmin] = useState(false)
  useEffect(() => { if (adminCreated) { togglesecondAdmin(true) } }, [adminCreated])

  return (
    <React.Fragment>
      <div className='new-modal__body'>
        {secondAdmin
          ? <React.Fragment>
              <h6 className='new-modal__body-title'>Who is the new project administrator?</h6>
              <label className='project-admin'>Project second administrator</label>
            <AdministratorFields admin='admins[1]' submitErrors={props.submitErrors} />
            </React.Fragment>
          : <React.Fragment>
              <h6 className='new-modal__body-title'>
                Would you like to add another administrator now?
              </h6>
              <button
                type='button'
                className='btn btn-purple full-wide'
                onClick={() => togglesecondAdmin(true)}
              >
                Add a second administrator
              </button>
            </React.Fragment>
          }
      </div>
      {renderSubmitButtons(secondAdmin, props)}
    </React.Fragment>
  )
}

export default SecondAdmin
