import React, { Component } from 'react'
import { connect } from 'react-redux'
import { change } from 'redux-form'
import classnames from 'classnames'

const initState = {
  file: '',
  imagePreviewUrl: ''
}

class FileField extends Component {

  state = initState

  componentWillUpdate(nextProps) {
    if (typeof nextProps.input.value === 'string') {
      this.props.input.onChange(null)
      this.setState({
        imagePreviewUrl: nextProps.input.value
      })
    }
  }

  discardLogo = () => {
    this.setState(initState)
    this.props.input.onChange({})
  }

  onInputChange = e => {
    e.preventDefault()

    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      })
    }
    reader.readAsDataURL(file)
    this.props.input.onChange(file)
  }

  renderLogo = url => {
    return (
      <div className='logo-container'>
        <div className='trash-icon-container'>
          <i
            className='svg-icon trash-icon white'
            onClick={this.discardLogo}
          />
        </div>
        <img src={url} /> 
      </div>
    )
  }

  render() {
    const { imagePreviewUrl } = this.state
    const { dataAllowedFileExtensions } = this.props
    const imagePreview = imagePreviewUrl ? this.renderLogo(imagePreviewUrl) : null
    const mainClass = classnames({'image-preview': imagePreview})
    
    return (
      <div className={mainClass}>
        {imagePreview}
        {!imagePreview &&
        <div>
          <input
            onChange={e => this.onInputChange(e)}
            id='file_logo'
            type='file'
            className='inputfile'
            data-allowed-file-extensions={dataAllowedFileExtensions}
          />
          <label htmlFor='file_logo'>
            <div>
              <i className='svg-icon blue-plus-icon' />
            </div>
            <strong>Add a logo</strong>
          </label>
        </div>}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  discardLogo: () => dispatch(change('company_form', 'company_data.logo', null))
})

export default connect(null, mapDispatchToProps)(FileField)