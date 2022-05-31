import React from 'react'
import logo from '../assets/images/nexus-logo.svg';

type Props = {}

const Logo = (props: Props) => {
  return (
    <div className="logo">
      <img src={logo} alt="Grindery Nexus logo" />
    </div>
  )
}

export default Logo