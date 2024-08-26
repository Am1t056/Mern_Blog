import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from "../assets/avatar1.jpg"
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns';




const PostAuthor = ({createdAt,authorID}) => {

  const [author,setAuthor]=useState({})

  const fetchAuthors=async()=>{
    try {
      const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${authorID}`)
      setAuthor(response?.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchAuthors()
  },[])
  return (
    <Link to={`/posts/users/${authorID}`} className='post__author'>
        <div className='post__author-avatar'>
            <img src={`${import.meta.env.VITE_ASSESTS_URL}/uploads/${author?.avatar}`} alt="" />
        </div>
        <div className="post__author-details">
            <h5>By: {author?.name}</h5>
            <small>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</small>
        </div>
    </Link>
  )
}

export default PostAuthor