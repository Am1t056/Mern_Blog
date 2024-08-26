import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate,useLocation } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import Loader from '../Components/Loader'


const DeletePost = ({postId: id}) => {
     const navigate=useNavigate()
     const location=useLocation()

     const [loading,setLoading]=useState(false)

     const {currentUser}=useContext(UserContext)
     const token=currentUser?.token;

     useEffect(()=>{
        if(!token){
          navigate('/login')
        }
     },[])

     const removePost=async()=>{
      setLoading(true)
      try {
        const response=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,{withCredentials:true, headers:{Authorization: `Bearer ${token}`}})
        if(response.status == 200){
          if(location.pathname == `/myposts/${currentUser.id}`){
            navigate(0)
          }else{
            navigate("/")
          }
        }
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
     }


     if(loading){
      return <Loader/>
     }

  return (
    <Link  className="btn sm danger" onClick={()=>removePost(id)}>
    Delete
  </Link>
  )
}

export default DeletePost