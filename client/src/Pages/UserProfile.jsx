import React, { useContext, useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from "react-router-dom"
// import Avatar from "../assets/avatar15.jpg"
import {FaEdit,FaCheck} from "react-icons/fa"
import { UserContext } from '../context/userContext'
import axios from 'axios'

const UserProfile = () => {
  const [avatar,setAvatar]=useState("")
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [currentPassword,setCurrentPassword]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [confirmNewPassword,setConfirmNewPassword]=useState("")

  const [isAvatarTouched,setIsAvatarTouched]=useState(false)


  const [error,setError]=useState("")
  const navigate=useNavigate()
  const {currentUser}=useContext(UserContext)
  const token=currentUser?.token

  useEffect(()=>{
    if(!token){
      navigate("/login")
    }
  },[])


  


  const getUser=async()=>{
     try {
      const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.id}`,{withCredentials: true, headers: {Authorization : `Bearer ${token}`}})
      const {name,email,avatar}=response.data
      setName(name)
      setEmail(email)
      setAvatar(avatar)
      
     } catch (err) {
      setError(err.response.data.message)
     }
  }

  useEffect(()=>{
     getUser()
  },[])


  const changeAvatarHandler=async()=>{
    setIsAvatarTouched(false)
    try {
      const postData=new FormData();
      postData.set("avatar",avatar)

      const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/changeavatar`,postData,{withCredentials:true , headers : {Authorization : `Bearer ${token}`}})
      setAvatar(response?.data?.avatar)

    } catch (err) {
      setError(err.response.data.message)
    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()

    try {


      const userData=new FormData()
      userData.set('name',name)
      userData.set('email',email)
      userData.set('avatar',avatar)
      userData.set('currentPassword',currentPassword)
      userData.set('newPassword',newPassword)
      userData.set('confirmNewPassword',confirmNewPassword)

      const response=await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/edituser`,userData,{withCredentials:true,headers:{Authorization : `Bearer ${token}`}})
      if(response.status == 200){
        navigate("/logout")
      }
      
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  
  return (
   <section className="profile">
      <div className="container profile__container">
           <Link to={`/myposts/${currentUser.id}`} className="btn">Dashboard</Link>

           <div className="profile__details">
            <div className="avatar__wrapper">
              <div className="profile__avatar">
                <img src={`${import.meta.env.VITE_ASSESTS_URL}/uploads/${avatar}`} alt="" />
              </div>

              {/* form to update avatar */}
              <form action="" className="avatar__form">
                <input type="file" name="avatar" id="avatar" onChange={(e)=>setAvatar(e.target.files[0])} accept='png,jpg,jpeg'/>
                <label htmlFor="avatar" onClick={()=>setIsAvatarTouched(true)}><FaEdit/></label>
              </form>
             {isAvatarTouched &&  <button className="profile__avatar-btn" onClick={changeAvatarHandler}>
                 <FaCheck/>
              </button>}
            </div>

            <h1>{currentUser?.name}</h1>

            {/* form to update user details */}
            <form action="" className="form profile__form" onSubmit={handleSubmit}>
              {error && <p className="form__error-message">
                This is an error message
              </p>}
              <input type="text" placeholder='Full name' value={name} onChange={(e)=>setName(e.target.value)}/>
              <input type="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
              <input type="password" placeholder='Current Password' value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
              <input type="password" placeholder='New Password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
              <input type="password" placeholder='Confirm New Password' value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)}/>
              <button type="submit" className='btn primary'>Update Details</button>

            </form>

           </div>


      </div>
   </section>
  )
}

export default UserProfile