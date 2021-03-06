import React, { useState } from 'react'

function Welcome() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        id='exampleModalLong'
        tabIndex='-1'
        role='dialog'
        aria-modal='true'
      >
        <div className='modal-window' role='document'>
          <div className='modal-content'>
            <div className='modal-body'>
              <h4>Welcome to i-Qoom!</h4>
              <p>You are now in the Project overview. This is where you will create and manage your projects.</p>
              <p>So, let's start your first project.</p>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-white' onClick={() => setShowModal(false)}>Cancel</button>
              <button type='button' className='btn btn-purple' onClick={() => setShowModal(false)}>Let's go</button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className='modal-backdrop fade show'></div>}
    </div>
  )
}

export default Welcome
