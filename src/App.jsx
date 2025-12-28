import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Data from './modules/Data';
import style from './modules/stylesheet.module.css';
import app from './firebase'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, addDoc, collection, CollectionReference, getDocs } from 'firebase/firestore';
function App() {

  const [a, setA]= useState(0);

  const auth= getAuth(app);
  const db= getFirestore(app);


  return (
    <>
      <div>

        {/* <p className={style.abc}>HI</p> {a} */}
   
   {/* <Data name="Debarun" address="school para"/> */}
{/* 
        <button onClick={()=>{setA(a+1)}}>Click </button> */}

        <input type='text' placeholder='Enter Product name' id="name"></input> <br/>
        <input type='text' id="price" placeholder='Enter price'></input> <br/>
        <input type='text' id="quantity" placeholder='Enter quantity'></input><br/>
        
        <button onClick={()=>{
            const pname=document.getElementById('name').value;
             const pprice=document.getElementById('price').value;
             const pquantity=document.getElementById('quantity').value;
             

             try{
                // createUserWithEmailAndPassword(auth, pname, pprice);


                const document={
                  name: pname,
                  price: pprice,
                  quantity: pquantity
                  
                }

                

                addDoc(collection(db, "users"), document);

             }catch(e){
                console.log(e);
             }
        }}  > Sign up</button>

        <button onClick={async ()=>{
             
              const col=collection(db, "users");
             const a= await getDocs(col);
             a.forEach((doc)=>{
              if(doc.data().price<=10000)
              console.log(doc.data().name);
             })


          



        }}  >Fetch</button>
       </div>
    </>
  )
}

export default App
