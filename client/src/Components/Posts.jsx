import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import Loader from "./Loader";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(posts)

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/posts`
      );
      setPosts(response?.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="posts">
      {loading ? (
        <Loader />
      ) : (
        <>
          {posts.length > 0 ? (
            <div className="container post__container">
              {posts.map(
                ({
                  _id:id,
                  thumbnail,
                  category,
                  title,
                  description,
                  creator,
                  createdAt
                }) => (
                  
                  <PostItem
                    key={id}
                    postID={id}
                    thumbnail={thumbnail}
                    category={category}
                    title={title}
                    description={description}
                    authorID={creator}
                    createdAt={createdAt}
                  />
                )
              )}
            </div>
          ) : (
            <h2 className="center">No Posts Found</h2>
          )}
        </>
      )}
    </section>
  );
};

export default Posts;
