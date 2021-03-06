import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouteMatch, Link } from 'react-router-dom'
import classnames from 'classnames'
import FolderInfo from '../FolderInfo'
import { getRevisionsAndVersions } from '../../../../../actions/documentsActions'

export function DocHistory() {
  const { projectId, document_id } = useParams()
  const { path } = useRouteMatch()
  const dispatch = useDispatch()
  const document = useSelector(state => state.documents.current)
  const revisions = useSelector(state => state.documents.revisions)
  revisions.sort((a, b) => {
    if (a.revision_number > b.revision_number) {
      return 1
    }
    if (a.revision_number < b.revision_number) {
      return -1
    }
    return 0
  })
  const [revision, toggleRevision] = useState(0)
  let currentRevisionNumber = document.document_fields
    .find(field => field.codification_kind === 'revision_number')
  currentRevisionNumber = currentRevisionNumber ? currentRevisionNumber.value : '0'
  let versionsList = revisions.find(el => el.revision_number === currentRevisionNumber)
  versionsList = versionsList ? versionsList.versions : []

  useEffect(() => { toggleRevision(currentRevisionNumber) }, [currentRevisionNumber, document_id])
  useEffect(() => { dispatch(getRevisionsAndVersions(document_id)) }, [dispatch, document_id])

  return (
    <React.Fragment>
      <div className="dms-sidebar-menu__block">
        <h4>Document history</h4>
        <div className="scroll-block">
          <div className="scroll-block-title">
            <span className="icon-Revise_1 dark-gray mr-2" />
            <span>Revisions</span>
          </div>
          <ul className="dms-sidebar-menu__ul-list">
            {revisions.map(({ revision_number: revisionNumber, versions }) => (
              <li
                className={classnames({ active: revisionNumber === revision })}
                key={revisionNumber}
              >
                <Link
                  to={path
                    .replace(':projectId', projectId)
                    .replace(':document_id', versions[versions.length - 1].id)}
                >
                  {revisionNumber.padStart(2, 0)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="dms-sidebar-menu__block">
        <div className="scroll-block">
          <div className="scroll-block-title">
            <span className="icon-task-list-settings dark-gray mr-2" />
            <span>Versions</span>
          </div>
          <ul className="dms-sidebar-menu__ul-list">
            {versionsList.map(({ id, revision_version: revisionVersion }) => (
              <li
                key={revisionVersion}
                className={classnames({ active: id === Number(document_id) })}
              >
                <Link to={path.replace(':projectId', projectId).replace(':document_id', id)}>
                  {revisionVersion.padStart(3, 0)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </React.Fragment>
  )
}

function SideBar() {
  const { projectId } = useParams()
  const document = useSelector(state => state.documents.current)

  return (
    <div className="dms-sidebar-menu">
      <div className="dms-sidebar-menu__document-title">
        <div className="editable-title">
          <h5>{document.title || 'Empty name'}</h5>
        </div>
        <FolderInfo />
        {false && (
          <React.Fragment>
            <div className="copied-to-folder">
              <span className="icon-check_3" />
              <span>Copied to folders</span>
              <button type="button" className="btn copy-to-folder">change</button>
            </div>
            <div className="not-relevant-for-me">
              <span>Not relevant for me</span>
              <button type="button" className="btn copy-to-folder">More</button>
            </div>
          </React.Fragment>
        )}
      </div>

      <DocHistory />

      <Link to={`/dashboard/projects/${projectId}/documents`} className="btn-back-to-prev-page">
        <span className="icon-Arrow_2_left mr-2">
          <span className="path1" />
          <span className="path2" />
        </span>
        BACK
      </Link>
    </div>
  )
}

export default SideBar
