import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

const renderBlock = field => {
  if (field.codification_kind === 'revision_number') {
    return (
      <React.Fragment>
        <label>{field.title}</label>
        <label className='rounded-label red'>
          {`Revision ${field.value}`}
          <i className='svg-icon pink lock-icon ml-2' />
        </label>
      </React.Fragment>
    )
  } else if (field.codification_kind === 'revision_version') {
    return (
      <React.Fragment>
        <label>{field.title}</label>
        <label className='rounded-label red'>
          {`Version ${field.value}`}
          <i className='svg-icon pink lock-icon ml-2' />
        </label>
      </React.Fragment>
    )
  } else if (field.codification_kind === 'revision_date') {
    return (
      <React.Fragment>
        <label>{field.title}</label>
        <span>{moment(new Date(field.value)).format('MM/DD/YYYY')}</span>
      </React.Fragment>
    )
  } else if (field.title && field.kind !== 'upload_field') {
    return (
      <React.Fragment>
        <label>{field.title}</label>
        <span>{field.value}</span>
      </React.Fragment>
    )
  }
}

const Content = ({ match: { params: { project_id, document_id } } }) => {
  const document = useSelector(state => state.documents.current)
  const firstColumn = document.document_fields.filter(el => el.column == 1 )
  const secondColumn = document.document_fields.filter(el => el.column == 2)
  const fileFields = document.document_fields.filter(el => el.kind === 'upload_field')

  return (
    <div className='show-document bordered'>
      <div className='dms-content__header'>
        <div className='d-flex'>
          <h4>Document details</h4>
          <div className='dms-content__header_links-block'>
            <Link
              to={`/dashboard/projects/${project_id}/documents/${document_id}/edit`}
              className='mx-4 link'
              data-title='Edit document'
            >
              Edit document
            </Link>
            <Link 
              to={`/dashboard/projects/${project_id}/documents/${document_id}/add_revision`}
              className='mx-4 link'
              data-title='Add revision'
            >
              Add revision
            </Link>
            <Link
              to='#'
              className='mx-4 link'
              data-title='Review document'
            >
              Review document
            </Link>
          </div>
        </div>
        <div className='dms-content__project-phases'>
          <span>Project phases</span>
          <ul className='row mx-0'>
            <li className='col-3 active'>
              <button>
                Planning
              </button>
            </li>
            <li className='col-3'>
              <button>
                Development
              </button>
            </li>
            <li className='col-3'>
              <button>
                Execution
              </button>
            </li>
            <li className='col-3'>
              <button>
                Operation
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className='document-show content-body'>
        <div className='main-block'>

          <div className='left-column'>
            <div className='document-show__info-row'>
              <label>Project</label>
              <span>{document.project_name}</span>
            </div>

            <div className='document-show__info-row'>
              <label>Document ID</label>
              <span>{document.document_id}</span>
            </div>

            {firstColumn.map((field, i) => (
              <div key={i} className='document-show__info-row'>
                {renderBlock(field)}
              </div>
            ))}
          </div>

          <div className='right-column'>
            <div className='document-show__info-row'>
            </div>

            <div className='document-show__info-row'>
              <label>Title</label>
              <span>{document.title}</span>
            </div>

            {secondColumn.map((field, i) => (
              <div key={i} className='document-show__info-row'>
                {renderBlock(field)}
              </div>
            ))}
          </div>
        </div>

        {/*<div className='document-show__text-row row'>
          <label className='mb-4'>Additional information</label>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>*/}

        <div className='document-show__files-row my-4'>
          <label className='mb-4'>Files</label>
          {fileFields.map((field, i) => (
            <div className='d-flex align-items-center mb-4' key={i}>
              <i className='svg-icon file-pdf-icon mr-2' />
              <span>{field.filename}</span>
            </div>
          ))}
        </div>

        <div className='main-block'>
          <div className='left-column'>
            <div className='document-show__info-row'>
              <label>Uploaded on</label>
              <span>12.10.2019</span>
            </div>
          </div>

          <div className='right-column'>
            <div className='document-show__info-row'>
              <label>Uploaded by</label>
              <span>John Doe</span>
            </div>
          </div>
        </div>

        <div className='info-block pt-4'>
          <div className='left-column'>
            <label>Access rights</label>
          </div>

          <div className='right-column'>
            <p>K. Koppes, D.Drennen, C. Caro, L. Lundell K. Koppes, D.Drennen, C. Caro, L. Lundell</p>
          </div>
        </div>

        <div className='info-block'>
          <div className='left-column'>
            <label>E-mail to</label>
          </div>

          <div className='right-column'>
            <p>Team Munster Windpark (Engeneers)</p>
          </div>
        </div>
      </div>

      <div className="document-show content-body">
        <div className='border-divider' />

        <div className='info-block pt-4'>
          <div className='left-column'>
            <div><label>Issued on</label></div>
            <div><span>12.10.2019</span></div>
          </div>

          <div className='right-column'>
            <p>K. Koppes, D.Drennen, C. Caro, L. Lundell</p>
          </div>
        </div>

        <div className='info-block'>
          <div className='left-column'>
            <label>By</label>
          </div>

          <div className='right-column'>
            <p>M. Lundell</p>
          </div>
        </div>

        <div className='border-divider' />

        <div className='info-block pt-4'>
          <div className='left-column'>
            <div><label>Reissued</label></div>
            <div><span>18.10.2019</span></div>
          </div>

          <div className='right-column'>
            <p>K. Koppes, D.Drennen, C. Caro, L. Lundell</p>
          </div>
        </div>

        <div className='info-block'>
          <div className='left-column'>
            <label>By</label>
          </div>

          <div className='right-column'>
            <p>M. Lundell</p>
          </div>
        </div>
      </div>
      

      <div className='dms-footer'>
        <button type='button' className='btn btn-white'>Back</button>
        <button type='button' className='btn btn-purple'>Edit</button>
        <button type='button' className='btn btn-purple'>Add revision</button>
      </div>
    </div>
  )
}

export default withRouter(Content)
