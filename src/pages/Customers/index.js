import { useState, useContext } from 'react';
import './customers.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../service/firebaseConnection'

import { toast } from 'react-toastify';

import { FiUser } from 'react-icons/fi';


export default function Customers() {

  const { user, signOut, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    if (nome !== '' && cnpj !== '' && endereco !== '') {
      await firebase.firestore().collection('customers')
        .add({
          nome: nome,
          cnpj: cnpj,
          endereco: endereco
        })
        .then(() => {
          setNome('');
          setCnpj('');
          setEndereco('');
          toast.info('Empresa cadastrada com sucesso!');
        })
        .catch((error) => {
          console.log(error);
          toast.error('Erro ao cadastrar essa empresa.');
        })

    } else {
      toast.error('Preencha todos os campos!')
    }
  }


  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>


        <div className="content">
          <form className="form-profile customers" onSubmit={handleSave}>


            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da sua empresa" />

            <label>CNPJ</label>
            <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="Seu CNPJ" />

            <label>Endereço</label>
            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço da sua empresa" />

            <button type="submit">Salvar</button>

          </form>
        </div>

        {/* <div className="content">
          <button className="logout-btn" onClick={() => signOut()} >
            Sair
          </button>
        </div> */}

      </div>
    </div>
  )
}
