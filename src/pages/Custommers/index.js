import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiUser } from 'react-icons/fi'
import {AuthContext} from '../../context/auth'
import { db } from '../../services/firebase'
import {  addDoc, collection } from 'firebase/firestore'
import './profile.css';
import { toast } from 'react-toastify'

export default function Custommers(){

  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [cnpj, setCnpj] = useState('')

  async function handleRegister(e){
    e.preventDefault()
    console.log(nome, endereco, cnpj)
    if(nome !== '' && endereco !== '' && cnpj !== ''){
      await addDoc(collection(db, 'custommers'), {
        nomeFantasia: nome,
        cnpj: cnpj,
        endereco: endereco,
      })
      .then(() => {
        toast.success("Adicionado com sucesso.")
        setNome('')
        setEndereco('')
        setCnpj('')
      })
      .catch(toast.error("Erro ao fazer cadastro"))
    }else{
      toast.warn("Preencha todos os campos")
    }

  }


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className='form-profile'> 
            <label>Nome fantasia</label>
            <input
              type='text'
              placeholder='Nome da empresa'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>CNPJ</label>
            <input
              type='text'
              placeholder='Digite o CNPJ'
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endereço</label>
            <input
              type='text'
              placeholder='Endereço da empresa'
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <button onClick={(e) => handleRegister(e)}>
              Salvar
            </button>

          </form>
        </div>

      </div>

    </div>
  )
}