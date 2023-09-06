import { useState, useContext } from 'react'
import { AuthContext } from '../../context/auth'
import { Link } from 'react-router-dom'
import './signup.css'

import logo from '../../assets/logo.png'

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    

    const {signUp, loadingAuth} = useContext(AuthContext)

    async function handleSubmit(e){
        e.preventDefault()

        if(name !== '' && email !== '' && password !== ""){
            await signUp(name, email, password)
            setEmail('')
            setPassword('')
            setName('')
        }
    }


    return(
        <div className='containe'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt="Logo do sistema de chamados"/>
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Cadastrar nova conta</h1>

                    <input
                        type='text'
                        placeholder='Nome'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='email@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='******'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type='submit'>
                        {loadingAuth ? "Carregando" : "Cadastrar"}
                    </button>
                </form>

                <Link to="/">
                    Já possuo uma conta
                </Link>

            </div>
        </div>
    )
}