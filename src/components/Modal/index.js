import { Link } from "react-router-dom"
import avatarImg from '../../assets/avatar.png'
import { useContext } from "react"
import { AuthContext } from "../../context/auth"
import {FiHome, FiUser, FiSettings, FiX} from 'react-icons/fi'
import './modal.css'

export default function Modal({conteudo, close}){
    const {user} = useContext(AuthContext)

    return(
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={25} color="#fff"/>
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>
                    <div className="row">
                        <span>Cliente: <i>{conteudo.cliente}</i></span>

                    </div>
                    <div className="row">
                        <span>Assunto: <i>{conteudo.assunto}</i></span>
                        <span>Cadastrado em: <i>{conteudo.created}</i></span>
                    </div>
                    <div className="row">
                        <span>Status: <i>{conteudo.status}</i></span>

                    </div>
                    {conteudo.complemento && <div className="row">
                        <span>Complemento: <p>{conteudo.complemento}</p></span>

                    </div> }
                    
                </main>

            </div>
            
            
        </div>
    )
}