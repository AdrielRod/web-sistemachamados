import { Link } from "react-router-dom"
import avatarImg from '../../assets/avatar.png'
import { useContext } from "react"
import { AuthContext } from "../../context/auth"
import {FiHome, FiUser, FiSettings} from 'react-icons/fi'
import './title.css'

export default function Title({children, name}){
    const {user} = useContext(AuthContext)

    return(
        <div className="title">
            {children}
            <span>{name}</span>
        </div>
    )
}