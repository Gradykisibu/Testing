import React from 'react'
import Activities from '../../components/Activities/Activities'
import WithLoggin from '../../components/context/HOC/WithAuth'

function Activity() {
  return (
    <div><Activities/></div>
  )
}

export default WithLoggin(Activity);