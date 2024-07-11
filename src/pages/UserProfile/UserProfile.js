import React from 'react'
import ProfileScreen from '../../components/ProfileScreen/ProfileScreen'
import WithLoggin from '../../components/context/HOC/WithAuth'

function UserProfile() {
  return (
    <div>
      <ProfileScreen/>
    </div>
  )
}

export default WithLoggin(UserProfile)