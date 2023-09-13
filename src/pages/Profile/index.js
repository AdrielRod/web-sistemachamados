import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import {AuthContext} from '../../context/auth'
import { db, storage } from '../../services/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import './profile.css';
import { toast } from 'react-toastify'
import { ref, uploadBytes,getDownloadURL  } from 'firebase/storage'

export default function Profile(){

  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
  const [imageAvatar, setImageAvatar] = useState(null)
  const [nome, setNome] = useState(user && user.nome)
  const [email, setEmail] = useState(user && user.email)

  function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image)
        setAvatarUrl(URL.createObjectURL(image))
      }else{
        toast.warn("Envia uma imagem do tipo PNG ou JPEG")
        setImageAvatar(null)
      }
    }
    console.log(e.target.value)
  }

  async function imageUpload(){
    const currentUid = user.uid
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)
    const uploadTask = uploadBytes(uploadRef, imageAvatar)
    .then(async(snapshot) => {
      getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
        let urlFoto = downloadUrl

        const docRef = doc(db, "users", user.uid)
        await updateDoc(docRef, {
          nome: nome,
          avatarUrl: urlFoto,
        })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          }  
          setUser(data)
          storageUser(data)
          toast.success("Alteração feita com sucesso.")
        })
        console.log("foi sal")
      })
      
      
    })
  }

  async function handleSubmit(e){
    console.log('entrou')
    e.preventDefault()

    if(imageAvatar === null && nome !== ''){
      console.log('entrou2')
      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        nome: nome,
      })
      .then(() => {
        let data = {
          ...user,
          nome: nome,
        }  
        setUser(data)
        storageUser(data)
        toast.success("Alteração feita com sucesso.")
      })
    }
    if(imageAvatar !== null && nome !== ''){
      imageUpload()
    }
  }


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>

       <div className="container">

        <form className="form-profile">
          <label className="label-avatar">
            <span>
              <FiUpload color="#FFF" size={25} />
            </span>

            <input type="file" accept="image/*" onChange={handleFile} /> <br/>
            {avatarUrl === null ? (
              <img src={avatar} alt="Foto de perfil" width={250} height={250} />
            ) : (
              <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} className='avatarUser'/>
            )}

          </label>

          <label>Nome</label>
          <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)}/>

          <label>Email</label>
          <input type="text" placeholder="teste@teste.com" disabled={true} value={email} />
          
          <button type="submit" onClick={(e) => handleSubmit(e)}>Salvar</button>
        </form>

       </div>

       <div className="container" onClick={() => logout()}>
         <button className="logout-btn">Sair</button>
       </div>

      </div>

    </div>
  )
}