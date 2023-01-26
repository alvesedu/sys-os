import React, { useContext } from 'react'
//import { Link } from 'react-router-dom'
import './title.css'
//import { AuthContext } from '../../contexts/auth';


function Title({ children, name }) {

  //const { user } = useContext(AuthContext);

  return (
    <div className="title">
      {children}
      <span>{name}</span>
    </div>


  )
}

export default Title;