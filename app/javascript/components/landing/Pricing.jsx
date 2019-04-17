import React, { Component } from 'react'

class Pricing extends Component {

  render() {
    const { toggleSignUp } = this.props
    return (
      <section id='pricing-card'>
        <div className='text-center container'>
          <h2 className='text-center block-header'>Pricing</h2>
          <h3 className='text-center'>Become an i-Qoom member and register for free</h3>
          <a href='#sign-up-form' className='btn btn-primary' onClick={toggleSignUp}>Register</a>
          <div className='pricing-project'>
            <h3>Pricing projects: yes, it's that easy</h3>
            <div className='row first-row'>
              <div className='col-6'>First 2 users</div>
              <div className='col-6'>for free</div>
            </div>
            <div className='row second-row'>
              <div className='col-6'>All additional users each</div>
              <div className='col-6'>89€</div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Pricing