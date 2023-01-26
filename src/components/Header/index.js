import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './header.css'
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png'
import { FiHome, FiUser, FiSettings } from "react-icons/fi";

function Header() {

  const { user, signOut } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Your avatar" />
        <h4 style={{ color: '#fff', marginTop: '10px', marginLeft: '10px' }}>Usuário: {user.nome} </h4>
      </div>

      <Link to="/dashboard">
        <FiHome color="#fff" size={24} />
        Chamados
      </Link>
      <Link to="/customers">
        <FiUser color="#fff" size={24} />
        Clientes
      </Link>
      <Link to="/profile">
        <FiSettings color="#fff" size={24} />
        Configurações
      </Link>


      <button className="btn-sair" onClick={() => signOut()} >
        <FiUser color="#000" size={18} style={{ marginRight: '5px' }} />
        Sair
      </button>

    </div>


  )
}

export default Header