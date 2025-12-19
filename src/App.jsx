import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Data from './modules/Data';
import style from './modules/stylesheet.module.css';
import app from './firebase'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
function App() {

  const [a, setA]= useState(0);

  const auth= getAuth(app);
  const db= getFirestore(app);

  return (
    <>
      <div>

        <p className={style.abc}>HI</p> {a}
   
   <Data name="Debarun" address="school para"/>

        <button onClick={()=>{setA(a+1)}}>Click </button>

        <input type='text' id="email"></input>
        <input type='text' id="password"></input>
        <input type="text" id="address"></input>
        <input type="text" id="XYZ"></input>
        <button onClick={()=>{
            const mail=document.getElementById('email').value;
             const pass=document.getElementById('password').value;
             const addr=document.getElementById('address').value;
             const random=document.getElementById('XYZ').value;

             try{
                createUserWithEmailAndPassword(auth, mail, pass);


                const document={
                  email: mail,
                  password: pass,
                  address:addr,
                  XYZ:random
                }

                

                addDoc(collection(db, "users"), document);

             }catch(e){
                console.log(e);
             }
        }}  > Sign up</button>
       </div>
    </>
  )
}

export default App
