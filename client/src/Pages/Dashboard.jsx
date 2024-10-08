import React, { useContext, useEffect, useState } from 'react'
// import {DUMMY_POSTS} from "../data"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import Loader from '../Components/Loader'
import DeletePost from './DeletePost'

const Dashboard = () => {
  const [posts,setPosts]=useState([])
  const [loading,setLoading]=useState(false)

  const {currentUser}=useContext(UserContext)
  const token=currentUser?.token

  const navigate=useNavigate()
   
  useEffect(()=>{
       if(!token){
         navigate("/")
       }
  },[])

  const {id}=useParams()
  const fetchPosts=async()=>{
    setLoading(true)
    try {
      const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/users/${id}`,{withCredentials: true , headers: {Authorization : `Bearer ${token}`}})
      setPosts(response.data)
      
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchPosts()
  },[id])

  if(loading){
    return <Loader/>
  }
  return (
 <section className="dashboard">
  {
    posts.length ? <div className='container dashboard__container'>  
     {
      posts.map((post)=>{
        return (
          <article key={post.id} className='dashboard__post'>
            <div className="dashboard__post-info">
              <div className="dashboard__post-thumbnail">
                 <img src={`${import.meta.env.VITE_ASSESTS_URL}/uploads/${post.thumbnail}`} alt="" />
              </div>
              <h5>{post.title}</h5>
            </div>
            <div className="dashboard__post-actions">
               <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
               <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
               <DeletePost postId={post._id}/>


            </div>

          </article>
        )
      })
     }

    </div>: <h2 className='center'>You have no posts yet!</h2>
  }
 </section>
  )
}

export default Dashboard