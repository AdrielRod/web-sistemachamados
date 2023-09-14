import { useContext, useState, useEffect } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle, FiUser } from 'react-icons/fi'
import {AuthContext} from '../../context/auth'
import { db } from '../../services/firebase'
import {  addDoc, collection, getDoc, getDocs, doc, updateDoc} from 'firebase/firestore'
import './New.css';
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const listRef = collection(db, 'custommers')

export default function New(){

  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const {id} = useParams()
  const navigate = useNavigate()

  const [custommers, setCustommers] = useState([])
  const [custommerSelected, setCustommerSelected] = useState(0)
  const [loadCustommers, setLoadCustommers] = useState(true)
  const [idCustommer, setIdCustommer] = useState(false)

  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [complemento, setComplemento] = useState('')

  useEffect(() => {
    async function loadCostommersData(){
      const querySnap = await getDocs(listRef)
      .then((snapshot) => {
        let lista = []
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia,
          })
        })

        console.log(lista)
        if(snapshot.docs.size === 0){
          toast.warn("Nenhuma empresa cadastrada.")
          setLoadCustommers(false)
          setCustommers([ {id: '1', nomeFantasia: 'Freela'}])
          return
        }
        setCustommers(lista)
        setLoadCustommers(false)

        if(id){
          loadId(lista)
        }
        

      })
      .catch((err) => {
        console.log('erro ao buscar clientes', err);
        setLoadCustommers(false)
        setCustommers([ {id: '1', nomeFantasia: 'Freela'}])
      })
    }
    loadCostommersData()
  }, [id])

  async function loadId(lista){
    const docRef = doc(db, 'chamados', id)
    await getDoc(docRef)
    .then((snap) => {
      setAssunto(snap.data().assunto)
      setStatus(snap.data().status)
      setComplemento(snap.data().complemento)
      
      let index = lista.findIndex(item => item.id === snap.data().clienteId)
      setCustommerSelected(index)
      setIdCustommer(true)

    })
    .catch((err) => {
      console.log(err)
      setIdCustommer(false)
    })
  }

  function handleOptionChange(e){
    setStatus(e.target.value)
    console.log(e.target.value)
  }

  function handleChangeSelect(e){
    setAssunto(e.target.value)
    console.log(e.target.value)
  }

  function handleChangeCustommer(e){
    setCustommerSelected(e.target.value)
  }

  async function handleRegister(e){
    e.preventDefault()
    if(idCustommer){
      console.log('entrou')
      const docRef = doc(db, 'chamados', id)
      await updateDoc(docRef, {
        cliente: custommers[custommerSelected].nomeFantasia,
        clienteId: custommers[custommerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid
      })
      .then(() => {
        toast.success("Chamado atualizado")
        setComplemento('')
        setCustommerSelected(0)
        navigate('/dashboard')
      })
      .catch((err) => {
        toast.error("Erro ao atualizar")
        console.log(err)
      })
      return
    }
    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: custommers[custommerSelected].nomeFantasia,
      clienteId: custommers[custommerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid
    })
    .then(() => {
      toast.success("Chamado registrado")
      setComplemento('')
      setCustommerSelected(0)
    })
    .catch((err) => {
      console.log(err)
      toast.error("Houve um erro.")
    })

  }


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo Chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className='form-profile'>
            <label>Clientes</label>
            { loadCustommers ? (
              <input type='text' disabled={true} value="Carregando"/>
            ) :
            (
              <select value={custommerSelected} onChange={handleChangeCustommer}>
                {custommers.map((item, index) => {
                  return(
                    <option key={index} value={index}>
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input
                type='radio'
                name='radio'
                value='Aberto'
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <span>Em aberto</span>

              <input
                type='radio'
                name='radio'
                value='Progresso'
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <span>Progresso</span>

              <input
                type='radio'
                name='radio'
                value='Atendido'
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea
              type="text"
              placeholder='Descreva o seu problema (opcional)'
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button onClick={handleRegister}>Registrar</button>

          </form>
        </div>

      </div>

    </div>
  )
}