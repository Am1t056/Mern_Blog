import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from "axios"

const Register = () => {
  const [userData,setUserData]=useState({
    name: "",
    email:"",
    password:"",
    password2:""
  })

  const [error,setError]=useState("")
  const navigate=useNavigate()

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
  setError('')
  try {
    const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`,userData)
    const dataResponse=await response.data;

    if(!dataResponse){
      setError('Registration failed')
    }
    alert("User Registered successfully")
    navigate('/login')
    
  } catch (err) {
    setError(err.response.data.message)
  }
}

  return (
  <section className="register">
     <div className="container">
      <h2>Sign Up</h2>
      <form action="" className="form register__form" onSubmit={handleSubmit}>
        {error && <p className="form__error-message">{error}</p> } 
         <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={handleChange}/>
         <input type="email" placeholder='Email' name='email' value={userData.email} onChange={handleChange}/>
         <input type="password" placeholder='Enter Password' name='password' value={userData.password} onChange={handleChange}/>
         <input type="password" placeholder='Enter Confirm Password' name='password2' value={userData.password2} onChange={handleChange}/>
         <button type='submit' className='btn primary'>Register</button>


      </form>
      <small>Already have an account? <Link to="/login">Sign In</Link></small>
     </div>
  </section>
  )
}

export default Register