import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserAvatar from 'react-user-avatar'
import { signOutUser } from '../../actions/userActions'

function TopBar() {
  const firstName = useSelector(state => state.user.first_name)
  const lastName = useSelector(state => state.user.last_name)

  const dispatch = useDispatch()

  const signOut = useCallback(() => {
    dispatch(signOutUser())
  }, [dispatch])

  return (
    <div className="top-bar-user-info">
      <h2 className="logo-png">
        logo
      </h2>
      <ul className="">
        <li className="nav-item">
          <button
            type="button"
            className="nav-link btn-transparent text-dark"
            onClick={signOut}
          >
            Logout
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className="btn">
            <span className="icon-email-action-unread" />
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className="btn">
            <span className="icon-alarm-bell" />
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className="nav-link btn-transparent user-info-avatar">
            <UserAvatar size="42" name={`${firstName} ${lastName}`} />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default TopBar
