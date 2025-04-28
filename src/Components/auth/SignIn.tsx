import React, {useState} from 'react'
import {auth} from "../../firebase"
import { signInWithEmailAndPassword } from 'firebase/auth';
import AuthDetails from './AuthDetails'

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) =>{
            console.log(userCredential);
        })
        .catch((error) =>{
            console.log(error);
        })
    }

    return(
        <div className = "sign-in-container">
            <form onSubmit = {signIn}>
                <h1>Log In</h1>
                <input type = "email" placeholder = "Enter your email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                ></input>
                <input type = "password" placeholder = "Enter your password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                ></input>
                <button type = "submit">Log In</button>
            </form>    
            <AuthDetails></AuthDetails>
        </div>
    )
}

export default SignIn