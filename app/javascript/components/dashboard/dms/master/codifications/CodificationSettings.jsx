import React from 'react'
import classnames from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import UserAvatar from 'react-user-avatar'
import DMSLayout from '../../DMSLayout'
import DmsSideBar from '../../sideBar/DmsSideBar'

function Card({ number, projectId }) {
  const active = number === 1

  return (
    <div className='conventions-settings-block'>
      <div className={classnames('conventions-settings-card', { active })} >
        <div className='check-icon'>
          {active &&
            <span className='icon-choose_2 mr-2'>
              <span className='path1' />
              <span className='path2' />
            </span>}
        </div>
        <div className='conventions-settings-title-card'>
          <span className='conventions-settings-card__title'>Convention {number}</span>
          {active && <span className='card-active'>Active</span>}
        </div>
        <Link
          to={`/dashboard/projects/${projectId}/documents/master/codifications/1/`}
          className='btn conventions-settings-btn-edit'
        >
          Edit
        </Link>
      </div>

      <div className='conventions-settings-conv-info'>
        <div className='conventions-settings-conv-info__row'>
          <label>Last change</label>
          <span>01.12.2020</span>
        </div>
        <div className='conventions-settings-conv-info__row'>
          <label>Changed by</label>
          <div className='changed-by'>
            <UserAvatar size='42' name='Abel Maria' className='' />
            <div className='changed-by__user-info'>
              <span>Abel Maria</span>
              <label>Company info</label>
            </div>
          </div>
        </div>
        <div className='conventions-settings-conv-info__row'>
          <label>Member ID</label>
          <a href='#'>salomonABCD1234</a>
        </div>
      </div>
    </div>
  )
}

function Content({ projectId }) {
  return (
    <div className='dms-content bordered'>
      <div className='dms-content__header'>
        <h4>Codificarion settings</h4>
      </div>
      <div className='content-body bottom-padding'>
        <label>Choose your preferences</label>
        <div className='conventions-settings-table'>
          {[...Array(3)].map((_, i) => { return <Card number={i + 1} key={i} projectId={projectId}/> }) }
        </div>
      </div>
    </div>
  )
}

function CodificationSettings({ match: { params: { projectId } } }) {
  return (
    <DMSLayout
      sidebar={<DmsSideBar />}
      content={<Content projectId={projectId} />}
    />
  )
}

export default withRouter(CodificationSettings)
