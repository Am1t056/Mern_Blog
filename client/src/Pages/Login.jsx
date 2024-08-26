import axios from 'axios'
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

import {UserContext} from "../context/userContext"
import { useContext } from 'react'

const Login = () => {
  const [userData,setUserData]=useState({
    email:"",
    password:"",
  })

  const [error,setError]=useState("")
  const navigate=useNavigate()

  const {setCurrentUser}=useContext(UserContext)
 

const handleChange=(e)=>{
  const {name,value}=e.target
  setUserData((prev)=>{
    return {
      ...prev,
      [name]:value
    }
  })
}

const handleSubmit=async(e)=>{
  e.preventDefault()
  setError("")
  try {
    const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/login`,userData)
   const dataResponse=await response.data;
   setCurrentUser(dataResponse)
   navigate("/") 
  } catch (err) {
     setError(err.response.data.message)
  }
}

// console.log(userData)
  return (
  <section className="login">
     <div className="container">
      <h2>Sign In</h2>
      <form action="" className="form login__form" onSubmit={handleSubmit}>
        {error &&  <p className="form__error-message">{error}</p>} 
        
         <input type="email" placeholder='Email' name='email' value={userData.email} onChange={handleChange} autoFocus/>
         <input type="password" placeholder='Enter Password' name='password' value={userData.password} onChange={handleChange}/>
   
         <button type='submit' className='btn primary'>Login</button>


      </form>
      <small>Don't have an account? <Link to="/register">Register</Link></small>
     </div>
  </section>
  )
}

export default Login