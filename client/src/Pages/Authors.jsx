import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'
import Loader from '../Components/Loader'



const Authors = () => {
  const [authors,setAuthors]=useState([])
  const [loading,setLoading]=useState(false)

  const fetchAuthorDetails=async()=>{
    setLoading(true)
    try {
      const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`)
      setAuthors(response.data)
    } catch (error) {
       console.error(error);
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchAuthorDetails()
  },[])

  if(loading){
    return <Loader/>
  }



  return (
  <section className="authors">
    { authors.length > 0 ?
      <div className="container authors__container">
       {
authors.map(({_id:id,avatar,name,posts})=>{
  return <Link key={id} to={`/posts/users/${id}`} className='author'>
    <div className="author__avatar">
        <img src={`${import.meta.env.VITE_ASSESTS_URL}/uploads/${avatar}`} alt={`Image of ${name}`} />
    </div>
    <div className="author__info">
      <h4>{name}</h4>
      <p>{posts}</p>
    </div>
  </Link>
})
       }
     </div> : <h2 className='center
     '>No Authors Found</h2>
     }
  </section>
  )
}

export default Authors