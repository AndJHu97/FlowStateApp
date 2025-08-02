import React, {useState} from 'react'
import {auth} from "../../firebase"
import { signInWithEmailAndPassword } from 'firebase/auth';
import AuthDetails from './AuthDetails'
import NavBar from '../NavBar';
import '../../output.css';

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

   return (
    <div>
        <NavBar></NavBar>
        
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Log In
            </h1>
            <form onSubmit={signIn} className="space-y-4">
                <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                Log In
                </button>
            </form>

            {/* AuthDetails component (e.g., shows user info or logout) */}
            <div className="mt-6">
                <AuthDetails />
            </div>
            </div>
        </div>
    </div>
    );

}

export default SignIn