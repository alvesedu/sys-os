import { useState, useEffect } from 'react';
import './dashboard.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
//import { AuthContext } from '../../contexts/auth';
import firebase from '../../service/firebaseConnection'
import { toast } from 'react-toastify';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link, useHistory, useParams } from 'react-router-dom';
import { format } from 'date-fns'
import Modal from '../../components/Modal';
import ModalDelete from '../../components/ModalDelete';



function Dashboard() {

  const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

  //const { signOut } = useContext(AuthContext);

  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [detailDelete, setDetailDelete] = useState();

  const history = useHistory();


  useEffect(() => {

    loadChamados()


  }, [setChamados])


  //Lista dados
  async function loadChamados() {
    await listRef.limit(5)
      .get()
      .then((snapshot) => {
        updateState(snapshot)
      })
      .catch((err) => {
        console.log(err);
        setLoadingMore(false)
      })

    setLoading(false)
  }

  //percorrendo o array de get
  async function updateState(snapshot) {
    const isCollection = snapshot.size === 0;

    if (!isCollection) {
      let lista = [];

      snapshot.forEach((item) => {
        lista.push({
          id: item.id,
          assunto: item.data().assunto,
          cliente: item.data().cliente,
          clienteId: item.data().clienteId,
          created: item.data().created,
          createdFormated: format(item.data().created.toDate(), 'dd/MM/yyyy'),
          status: item.data().status,
          complemento: item.data().complemento,
        })
      })

      //Pegando o ultimo documento buscado
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];

      setChamados(chamados => [...chamados, ...lista])

      setLastDocs(lastDoc)
    } else {
      setIsEmpty(true)
    }

    setLoadingMore(false)
  }

  //carregar mais dados da lista
  async function handleMore() {
    setLoadingMore(true)
    await listRef.startAfter(lastDocs)
      .limit(5)
      .get()
      .then((snapshot) => {
        updateState(snapshot)
      })
  }

  async function handleDelete(id) {

    await firebase.firestore().collection('chamados')
      .doc(id)
      .delete()
      .then(() => {
        toast.error('Chamado excluído com sucesso!');
        //loadChamados()
        history.push('/new');
        //window.location.reload(true)
        //setLoading(true)
        //setLoading(false)
      })
      .catch((erro) => {
        alert('Error to delete the post' + erro)
      })
  }

  function togglePostModal(item) {
    setShowPostModal(!showPostModal); //trocando de true pra false (toggle)
    setDetail(item);
  }

  function toggleModalDelete(item) {
    setShowModalDelete(!showModalDelete); //trocando de true pra false (toggle)
    setDetailDelete(item);
  }


  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Chamados">
            <FiMessageSquare size={25} />
          </Title>
        </div>

        <div className="content-container dashboard">
          <span>Buscando chamados...</span>

          <Link to="/new" className="new">
            <FiPlus />
            Novo chamado
          </Link>
        </div>

      </div>
    )
  }


  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Chamados">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length === 0 ? (
          <div className="content-container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus />
              Novo chamado
            </Link>
          </div>
        )
          : (
            <>
              <Link to="/new" className="new">
                <FiPlus />
                Novo chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>

                <tbody>

                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#3583f6' }}>{item.status}</span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormated}</td>
                        <td data-label="Ações">
                          <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => togglePostModal(item)}>
                            <FiSearch color='#FFF' size={17} />
                          </button>

                          <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#5cb85c' }}>
                            <FiEdit2 color='#FFF' size={17} />
                          </Link>


                          {/*  <button onClick={() => handleDelete(item.id)} className="action" style={{ backgroundColor: '#F54D29' }}>
                            <FiTrash2 color='#FFF' size={17} />
                          </button> */}
                          <button onClick={() => toggleModalDelete(item)} className="action" style={{ backgroundColor: '#F54D29' }}>
                            <FiTrash2 color='#FFF' size={17} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}


                </tbody>

              </table>

              {loadingMore && <h3 style={{ textAlign: 'center', marginTop: 15 }}>Buscando chamados</h3>}
              {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}

            </>
          )
        }
      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={togglePostModal}
        />
      )}

      {showModalDelete && (
        <ModalDelete
          handleDelete={handleDelete}
          conteudo={detailDelete}
          close={toggleModalDelete}
        />
      )}


    </div>
  );
}

export default Dashboard;