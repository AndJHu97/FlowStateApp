import React, {useState} from 'react'
import {auth, database} from "../../firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, update } from "firebase/database";

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

    return(
        <div className = "sign-in-container">
            <form onSubmit = {signUp}>
                <h1>Create Account</h1>
                <input type = "email" placeholder = "Enter your email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                ></input>
                <input type = "password" placeholder = "Enter your password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                ></input>
                <button type = "submit">Sign Up</button>
            </form>    
        </div>
    )
}

export default SignUp