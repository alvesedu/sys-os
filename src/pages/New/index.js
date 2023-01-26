import { useState, useEffect, useContext } from 'react';
import './new.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../service/firebaseConnection'
//import { db } from '../../service/firebaseConnection'

import { toast } from 'react-toastify';

import { FiPlusCircle } from 'react-icons/fi';
import { useParams, useHistory } from 'react-router-dom';
//import { collection, getDocs, getDoc, doc, addDoc } from 'firebase/firestore'


export default function New() {

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const [idCustomer, setIdCustomer] = useState(false)

  const [customers, setCustomers] = useState([])
  const [loadCustomers, setLoadCustomers] = useState(true)
  const [customersSelected, setCustomersSelected] = useState(0)

  const { user, signOut, setUser, storageUser } = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();
  // const navigate = useNavigate();


  useEffect(() => {

    //listando clientes
    async function loadCustomers() {
      await firebase.firestore().collection('customers')
        .get()
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((item) => {
            lista.push({
              id: item.id,
              nome: item.data().nome
            })
          })

          if (lista === 0) {
            console.log('Nenhuma empresa encontrada!');
            setLoadCustomers(false);
            setCustomers([{ id: '1', nome: 'Freela' }]);
            return;
          }

          setLoadCustomers(false);
          setCustomers(lista)

          if (id) {
            loadId(lista)
          }

        })
        .catch((error) => {
          console.log('Deu erro ao carregar', error);
          setLoadCustomers(false);
          setCustomers([{ id: '1', nome: '' }]);
        });
    }

    loadCustomers();
  }, [id])

  async function loadId(lista) {
    await firebase.firestore().collection('chamados').doc(id)
      .get()
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
        setCustomersSelected(index);
        setIdCustomer(true);


      })
      .catch((err) => {
        console.log('Erro no ID passado: ', err);
        setIdCustomer(false);
      })
  }


  async function handleSave(e) {
    e.preventDefault();

    if (idCustomer) {
      await firebase.firestore().collection('chamados')
        .doc(id)
        .update({
          cliente: customers[customersSelected].nome,
          clienteId: customers[customersSelected].id,
          assunto,
          status,
          complemento,
          userId: user.uid
        })
        .then(() => {
          toast.info('Chamado editado com sucesso!');
          setCustomersSelected(0);
          setComplemento('');
          history.push('/dashboard');
          //navigate('/dashboard');
        })
        .catch((err) => {
          toast.error('Ops, erro ao editar chamado, tente novamente mais tarde.', err);
          //console.log(err);
        })

      return;
    }

    await firebase.firestore().collection('chamados')
      .add({
        created: new Date(),
        cliente: customers[customersSelected].nome,
        clienteId: customers[customersSelected].id,
        assunto,
        status,
        complemento,
        userId: user.uid
      })
      .then(() => {
        toast.success('Chamado salvo com sucesso!')
        setComplemento('')
        setCustomersSelected(0)
        setAssunto(0)
        setStatus(0)
        history.push('/dashboard');

      })
      .catch((error) => {
        toast.error('Erro ao salvar, verifique as informações!', error);
        //console.log(error);
      })
  }

  //chamado quando troca o assunto
  function handleChangeSelect(e) {
    setAssunto(e.target.value)
    //console.log(e.target.value);
  }

  //chamado quando troca o status
  function handleChangeOptionRadius(e) {
    setStatus(e.target.value)
    //console.log(e.target.value);
  }

  //chamado quando troca o cliente
  function handleChangeCustomers(e) {
    setCustomersSelected(e.target.value)
    //console.log(e.target.value, customers[e.target.value]);
  }


  return (
    <div>
      <Header />

      <div className="content">
        <Title name={id ? "Editando chamado" : "Novo chamado"}>
          <FiPlusCircle size={25} />
        </Title>


        <div className="content">
          <form className="form-profile" onSubmit={handleSave}>


            <label>Cliente</label>
            {loadCustomers ?
              (
                <input type="text" disabled={true} value='Carregando...' />
              )
              :
              (
                <select value={customersSelected} onChange={handleChangeCustomers}>
                  {customers.map((item, index) => {
                    return (
                      <option key={item.id} value={index}>
                        {item.nome}
                      </option>
                    )
                  })}
                </select>
              )
            }


            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value='Suporte'>Suporte</option>
              <option value='Redes / Internet'>Redes / Internet</option>
              <option value='Financeiro'>Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name='radio'
                value="Aberto"
                onChange={handleChangeOptionRadius}
                checked={status === 'Aberto'}
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name='radio'
                value="Progresso"
                onChange={handleChangeOptionRadius}
                checked={status === "Progresso"}
              />
              <span>Em progresso</span>

              <input
                type="radio"
                name='radio'
                value="Atendido"
                onChange={handleChangeOptionRadius}
                checked={status === "Atendido"}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              style={{ width: '100%', height: '95px', resize: 'none' }}
              type="text"
              placeholder="Digite seu problema (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Salvar</button>

          </form>
        </div>

      </div>
    </div>
  )
}
