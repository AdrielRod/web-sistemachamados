import { useContext, useState, useEffect } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { Link } from 'react-router-dom'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import {AuthContext} from '../../context/auth'
import { db, storage } from '../../services/firebase'
import { doc, updateDoc, addDoc, collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore'
import './index.css';
import { toast } from 'react-toastify'
import { ref, uploadBytes,getDownloadURL  } from 'firebase/storage'
import format from 'date-fns/format'
import Modal from '../../components/Modal'
const listRef = collection(db, 'chamados')

export default function Dashboard(){

  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([])
  const [isEmpty, setIsEmpty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastDocs, setLastDocs] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [detail, setDetail] = useState()

  useEffect(() => {
    async function loadChamados(){
      const q = query(listRef, orderBy('created', 'desc'), limit(3))
      const querySnap = await getDocs(q)
      setChamados([])

      await updateState(querySnap)

      setLoading(false)
    }
    loadChamados()

    return () => {}
  }, [])

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0
    if(!isCollectionEmpty){
      let lista = []
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          assunto: doc.data().assunto,
          clienteId: doc.data().clienteId,
          created: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

      setLastDocs(lastDoc)
      setChamados(chamados => [...chamados, ...lista])
    }else{
      setIsEmpty(true)
    }

    setLoadingMore(false)
  }

  async function handleMore(){
    setLoadingMore(true)

    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(3))
    const querySnapshot = await getDocs(q)

    await updateState(querySnapshot)

    

  }

  if(loading){
    return(
      <div>
        <Header/>
        <div className='content'>
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className='container dashboard'>
            <span>Buscando chamados</span>
          </div>
        </div>
      </div>
    )
  }

  function toggleModal(item){
    setShowModal(!showModal)
    setDetail(item)
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {!chamados ? (
            <div className='container dashboard'>
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className='new'>
                <FiPlus color='#fff' size={25}/> Novo Chamado
              </Link>
            </div>
          ): (
            <>
              <Link to="/new" className='new'>
                <FiPlus color='#fff' size={25}/> Novo Chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope='col'>Cliente</th>
                    <th scope='col'>Assunto</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Cadastrado</th>
                    <th scope='col'>#</th>
                  </tr>
                </thead>
                  <tbody>
                    {chamados.map((item, index) => {
                      return(
                        <tr key={index}>
                          <td data-label="Cliente">{item.cliente}</td>
                          <td data-label="Assunto">{item.assunto}</td>
                          <td data-label="Status">
                          <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                          </td>
                          <td data-label="Cadastrado">{item.created}</td>
                          <td data-label="#">
                            <button className='action' style={{backgroundColor: '#3583f6'}} onClick={() => toggleModal(item)}>
                              <FiSearch color='#fff' size={17}/>
                            </button>
                            <Link to={`/new/${item.id}`} className='action' style={{backgroundColor: '#f6a935'}}>
                              <FiEdit2 color='#fff' size={17}/>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {loadingMore && <h3>Buscando mais chamados...</h3>}
                {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button>}
                
            </>
          )}        
        </>
      </div>

      {showModal && <Modal conteudo={detail} close={() => setShowModal(!showModal)}/>}

      
    </div>
  )
}