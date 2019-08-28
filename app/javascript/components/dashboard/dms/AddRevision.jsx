import React, { Component } from 'react'
import ReactSVG from 'react-svg'
import { connect } from 'react-redux'
import DropZoneField from '../../../elements/DropZoneField'
import InputField from '../../../elements/InputField'
import overviewIcon from '../../../images/task-checklist-check'
import revisionIcon from '../../../images/Revise_2'
import allDocIcon from '../../../images/folder-image'
import myDocIcon from '../../../images/folder-image-1'
import plus from '../../../images/add_1'
import folderIcon from '../../../images/folder-empty'
import dmsSettingsIcon from '../../../images/task-list-settings'
import editIcon from '../../../images/pencil-write'
import lockIcon from '../../../images/Locked'
import checkIcon from '../../../images/check_1'
import { DmsSideBarItem } from './DmsSideBar'
import {
  getFormSubmitErrors,
  reduxForm,
  Field
} from 'redux-form'

const menuItems = [
  {
    title: 'Documents data & files',
    icon: overviewIcon,
    path: '/dashboard/documents/new/'
  },
  {
    title: 'Access & Communication',
    icon: dmsSettingsIcon,
    path: '/dashboard/documents/new/'
  }
]

class AddRevision extends Component {

  state = {
    popup: false
  }

  renderPopCreateFolder = () => {
    const { popup } = this.state

    return (
      <div className='copy-to-folder-block'>
        <button className='btn btn-copy-to-folder' onClick={() => this.setState({ popup: !popup })}>Copy to folder</button>

        {popup &&
        <div className='copy-to-folder-block__popup'>
          <label className='copy-to-folder-block__popup_title'>Copy to folder</label>
          <ul>
            <li className='new-folder'>
              <ReactSVG
                svgStyle={{ height: 15, width: 15, marginRight: 10 }}
                src={plus}
              />
              <span>New folder</span>
            </li>
            <li className='checked'>
              <input
                type='checkbox'
                id='my_concerns'
                checked={true}
                onChange={(val) => console.log(val)}
              />
              <label htmlFor='my_concerns' />
              <ReactSVG
                svgStyle={{ height: 15, width: 15, marginRight: 10, marginLeft: 10 }}
                src={folderIcon}
              />
              <span>My concerns</span>
            </li>
            <li>
              <input
                type='checkbox'
                id='my_concerns'
                checked={false}
                onChange={(val) => console.log(val)}
              />
              <label htmlFor='my_concerns' />
              <ReactSVG
                svgStyle={{ height: 15, width: 15, marginRight: 10, marginLeft: 10 }}
                src={folderIcon}
              />
              <span>Not relevant for me</span>
            </li>
            <li className='disabled'>
              <input
                type='checkbox'
                id='my_concerns'
                checked={false}
                onChange={(val) => console.log(val)}
              />
              <label htmlFor='my_concerns' />
              <ReactSVG
                svgStyle={{ height: 15, width: 15, marginRight: 10, marginLeft: 10 }}
                src={allDocIcon}
              />
              <span>All documents</span>
            </li>
            <li className='disabled'>
              <input
                type='checkbox'
                id='my_concerns'
                checked={false}
                onChange={(val) => console.log(val)}
              />
              <label htmlFor='my_concerns' />
              <ReactSVG
                svgStyle={{ height: 15, width: 15, marginRight: 10, marginLeft: 10 }}
                src={myDocIcon}
              />
              <span>My documents</span>
            </li>
          </ul>
        </div>}
      </div>
    )
  }

  render() { 
    const { submitErrors } = this.props
    return (
      <div className='dms-container'>
        <div className='dms-content'>
          <div className='row pt-5'>
            <div className='col-2'>
              <div className='dms-sidebar-menu'>

                <div className='dms-sidebar-menu__document-title'>
                  <div className='editable-title'>
                    <h5>Presure Relief Dampers - Remediation of Defect by Mr. Cool</h5>
                    <ReactSVG
                      svgStyle={{ height: 13, width: 13, marginLeft: 10 }}
                      src={editIcon}
                    />
                  </div>
                  {this.renderPopCreateFolder()}

                  {false && <React.Fragment>
                    <div className='copied-to-folder'>
                      <ReactSVG
                        svgStyle={{ height: 13, width: 13, marginLeft: 10 }}
                        src={checkIcon}
                      />
                      <span>Copied to folders</span>
                      <button className='btn copy-to-folder'>change</button>
                    </div>
                    <div className='not-relevant-for-me'>
                      <span>Not relevant for me</span>
                      <button className='btn copy-to-folder'>More</button>
                    </div>
                  </React.Fragment>}
                </div>

                <div className='dms-sidebar-menu__block'>
                  <h4>DMS menu</h4>
                  <ul className='dms-sidebar-menu__list'>
                    {menuItems.map(({ path, title, icon }, i) => (
                      <React.Fragment key={i}>
                        <DmsSideBarItem path={path} label={title} icon={icon} />
                      </React.Fragment>
                    ))}
                  </ul>
                </div>

                <div className='dms-sidebar-menu__block'>
                  <h4>Document history</h4>
                  <div className='scroll-block'>
                    <div className='scroll-block-title'>
                      <ReactSVG
                        svgStyle={{ height: 15, width: 15, marginLeft: 10, marginRight: 10 }}
                        src={revisionIcon}
                      />
                      <span>Revision</span>
                    </div>
                    <ul className='revision-list'>
                      {[...Array(40)].map((e, i) => (
                        <li key={i}>
                          {i + 1}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className='dms-sidebar-menu__block'>
                  <h4>Document history</h4>
                  <div className='scroll-block'>
                    <div className='scroll-block-title'>
                      <ReactSVG
                        svgStyle={{ height: 15, width: 15, marginLeft: 10, marginRight: 10 }}
                        src={dmsSettingsIcon}
                      />
                      <span>Versions</span>
                    </div>
                    <ul className='revision-list'>
                      {[...Array(2)].map((e, i) => (
                        <li key={i}>
                          {i + 1}
                        </li>
                      ))}
                      <li className='active'>
                        3.0
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            <div className='col-10 p-0 mb-5 bordered'>
              <div className='p-5'>
                <div className='revision-title-block'>
                  <h5>Add new Revision:</h5>
                  <label className='rounded-label red ml-4'>
                    Revision 41
                    <ReactSVG
                      svgStyle={{ height: 13, width: 13, marginLeft: 10 }}
                      src={lockIcon}
                    />
                  </label>
                  <label className='rounded-label red ml-4'>
                    Version 0.0
                    <ReactSVG
                      svgStyle={{ height: 13, width: 13, marginLeft: 10 }}
                      src={lockIcon}
                    />
                    </label>
                </div>

                <h5>Open upload form</h5>

                <div className='form-group col-6 pl-0 mt-4'>
                  <Field
                    component={InputField}
                    name='originator'
                    id='originator'
                    errorField={[submitErrors]}
                    placeholder='Originator'
                    label='Type in originator*'
                  />
                </div>

                <div className='row mt-5'>
                  <div className='col-6'>
                    <Field
                      type='file'
                      name='native_file'
                      id='native_file'
                      label='Replace the document file to update revision*'
                      component={DropZoneField}
                    />
                  </div>
                  <div className='col-6'>
                    <Field
                      type='file'
                      name='other_file'
                      id='other_file'
                      label='Add other file here'
                      component={DropZoneField}
                    />
                  </div>
                </div>
              </div>

              <div className='dms-footer'>
                <button type='button' className='btn btn-white'>Cancel</button>
                <button
                  type='submit'
                  className='btn btn-purple'
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  submitErrors: getFormSubmitErrors('revision_form')(state)
})

export default connect(
  mapStateToProps
)(reduxForm(
  {
    form: 'revision_form',
  })
  (AddRevision))