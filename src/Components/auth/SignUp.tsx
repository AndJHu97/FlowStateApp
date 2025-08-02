import React, {useState} from 'react'
import {auth, database} from "../../firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, update } from "firebase/database";
import NavBar from '../NavBar';
import '../../output.css';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const defaultDecks = {
        Act: "",
        Crave: "",
        Ego: "",
        Energy: "",
        Engagement: "",
        Prey: "",
        Trials: ""
    };
    
    

    const signUp = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Decks data:', defaultDecks);

            //create entry in the database
            await set(ref(database, `users/${user.uid}`), {
                email: user.email
            });
            await update(ref(database, `users/${user.uid}/decks`), defaultDecks);
            
            console.log("User created & deck structure initialized:", user.uid);
        }catch(error: any){
            console.error("Error signing up: ", error?.message || error);
        }
    }

    return (
    <div>
        <NavBar></NavBar>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Create Account
            </h1>
            <form onSubmit={signUp} className="space-y-4">
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
                Sign Up
                </button>
            </form>
            </div>
        </div>
    </div>
);

}

export default SignUp