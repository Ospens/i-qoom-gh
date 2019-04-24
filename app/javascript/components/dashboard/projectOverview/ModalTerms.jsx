import React from 'react'
import ModalComponent from '../../../elements/ModalComponent'

function ModalTerms({ toogleTerms, closeModal, termsAccepted, nextStep}) {
  return (
    <ModalComponent>
      <div>
        <div className='modal-body terms-modal'>
          <h5>Please read our <a href='#'>Terms and Conditions</a></h5>
          <h5>and check the box below</h5>

          <div className='checkbox-terms rect-checkbox'>
            <input
              type='checkbox'
              id='terms'
              onClick={toogleTerms}
            />
            <label htmlFor='terms'></label>
            <span>I have read and agree to the Terms</span>
          </div>
        </div>
        <div className='modal-footer'>
          <button type='button' className='btn btn-white' onClick={closeModal}>Cancel</button>
          <button type='button' className='btn btn-purple' disabled={!termsAccepted} onClick={nextStep}>Next</button>
        </div>
      </div>
    </ModalComponent>
  )
}

export default ModalTerms
