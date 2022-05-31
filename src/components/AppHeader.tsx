import React from 'react'
import Logo from './Logo'

type Props = {}

const AppHeader = (props: Props) => {
  return (
    <div className="header">
        <Logo />
    </div>
  )
}

export default AppHeader