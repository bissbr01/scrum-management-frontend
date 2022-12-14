import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function Auth0LogoutButton() {
  const { logout } = useAuth0()

  return (
    <button
      type="button"
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </button>
  )
}
