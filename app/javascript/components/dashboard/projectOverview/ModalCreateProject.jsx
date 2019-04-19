import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import ModalTerms from './ModalTerms'
import ModalFirstAdmin from './ModalFirstAdmin'
import ModalSecondAdmin from './ModalSecondAdmin'
import ModalProjectName from './ModalProjectName'
import ModalCompanyData from './ModalCompanyData'
import ModalSuccessfull from './ModalSuccessfull'
import ModalBillingAddress from './ModalBillingAddress'

class ModalCreateProject extends Component {

  state = {
    step: 1,
    termsAccepted: false,
  }

  changeStep = (increase) => {
    const { step } = this.state
    this.setState({ step: step + increase })
  }

  toogleTerms = () => {
    const { termsAccepted } = this.state
    this.setState({ termsAccepted: !termsAccepted })
  }

  closeModalAndDiscardSteps = () => {
    const { resetForm } = this.props
    const { closeModal } = this.props
    this.setState({ step: 1, termsAccepted: false })
    resetForm('create_project')
    resetForm('create_administrator')
    closeModal()
  }

  render() {
    const { termsAccepted, step } = this.state
    const { isOpen } = this.props
    if (!isOpen) {
      return false
    }

    return (
      <div>
        {step === 1 &&
          <ModalTerms
            toogleTerms={this.toogleTerms}
            closeModal={this.closeModalAndDiscardSteps}
            termsAccepted={termsAccepted}
            nextStep={() => this.changeStep(1)}
          />
        }
        {step === 2 &&
          <ModalFirstAdmin
            closeModal={this.closeModalAndDiscardSteps}
            customSubmit={() => this.changeStep(1)}
          />
        }
        {step === 3 &&
          <ModalSecondAdmin
            closeModal={this.closeModalAndDiscardSteps}
            customSubmit={() => this.changeStep(1)}
          />
        }
        {step === 4 &&
          <ModalProjectName
            closeModal={this.closeModalAndDiscardSteps}
            customSubmit={(increase) => this.changeStep(increase)}
          />
        }
        {step === 5 &&
          <ModalCompanyData
            closeModal={this.closeModalAndDiscardSteps}
            customSubmit={(increase) => this.changeStep(increase)}
          />
        }
        {step === 6 &&
          <ModalBillingAddress
            closeModal={this.closeModalAndDiscardSteps}
            customSubmit={() => this.changeStep(1)}
          />
        }
        {step === 7 &&
          <ModalSuccessfull
            closeModal={this.closeModalAndDiscardSteps}
            customSubmit={(increase) => this.changeStep(increase)}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  resetForm: (formName) => dispatch(reset(formName))
})

export default connect(null, mapDispatchToProps)(ModalCreateProject)
