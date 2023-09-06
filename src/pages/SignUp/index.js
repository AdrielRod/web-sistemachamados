import { useState } from 'react'
import { Link } from 'react-router-dom'
import './signup.css'

import logo from '../../assets/logo.png'

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    function handleSubmit(e){
        e.preventDefault()

        if(name !== '' && email !== '' && password !== ""){
            alert("Fazer cadastro")
        }
    }


    return(
        <div className='container'>
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

                    <button type='submit'>Cadastrar</button>
                </form>

                <Link to="/">
                    Já possuo uma conta
                </Link>

            </div>
        </div>
    )
}