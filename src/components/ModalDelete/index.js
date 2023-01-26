import React from 'react'
import './modalDelete.css'
import { FiX } from 'react-icons/fi';

function ModalDelete({ conteudo, close, handleDelete }) {

  console.log(conteudo);
  return (
    <div className='modal'>
      <div className='container'>
        <button className='close' onClick={close}>
          <FiX size={23} color="#FFF" />
          {/* Voltar */}
        </button>

        <div>
          <h3>Detalhes da Exclusão</h3>

          <div className='row'>
            <span>
              Tem certeza de que deseja realmente excluir?
            </span>
          </div>

          <div>
            <button className='btn-yes' onClick={() => handleDelete(conteudo.id)}>
              <FiX size={23} color="#FFF" />
              Sim
            </button>
            <button className='btn-no' onClick={close}>
              <FiX size={23} color="#FFF" />
              Não
            </button>
          </div>




          {/*  <div className='row'>
            <span>
              Assunto: <i>{conteudo.assunto}</i>
            </span>
            <span>
              Cadastrado em: <i>{conteudo.createdFormated}</i>
            </span>
          </div> */}

          {/*  <div className='row'>
            <span >
              Status: <i className='status-badge' style={{ color: '#FFF', backgroundColor: conteudo.status === 'Aberto' ? '#5cb75c' : '#999' }}>{conteudo.status}</i>
            </span>
          </div> */}

          {/* {conteudo.complemento !== '' && (
            <>
              <h3>Complemento</h3>
              <p>
                {conteudo.complemento}
              </p>
            </>
          )} */}

        </div>
      </div>
    </div>
  );
}

export default ModalDelete;