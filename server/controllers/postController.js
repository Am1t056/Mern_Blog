const postModel = require("../models/posts.model")
const userModel = require("../models/user.model")
const path=require("path")
const fs=require("fs")
const {v4: uuid}=require("uuid")
const HttpError = require("../models/errorModel")


//====================Create a post ====================//
//POST:api/posts
//PROTECTED
const createPost=async(req,res,next)=>{
try {
    const {title,description,category}=req.body
    if(!title || !description || !category){
        return next(new HttpError("Please fill in all fields",422))
    }

    const {thumbnail}=req.files;

    //check  the file size
    if(thumbnail.size>2000000){
        return next(new HttpError("File size is too large..should be less than 2mb",422))
    }

    let fileName=thumbnail.name
    let splittedFileName=fileName.split(".")
    let newFilename=splittedFileName[0]+ uuid()+"."+splittedFileName[splittedFileName.length - 1]
    thumbnail.mv(path.join(__dirname,"..","/uploads",newFilename),async(err)=>{
         if(err){
            return next(new HttpError("Failed to upload file",500))
         }else{
            const newPost=await postModel.create({title,category,description,thumbnail:newFilename,creator:req.user.id})
            if(!newPost){
                return next(new HttpError("Failed to create post",422))
            }
            //find user and increase post count by 1
            const currentUser=await userModel.findById(req.user.id)
            const userPostsCount=currentUser.posts + 1;
            await userModel.findByIdAndUpdate(req.user.id,{posts: userPostsCount})

            res.status(201).json(newPost)

            
         }
    })
} catch (error) {
    return next(new HttpError(error))
}
}


//====================GET all posts ====================//
//GET:api/posts
//UNPROTECTED
const getPosts=async(req,res,next)=>{
   try {
    const posts=await postModel.find().sort({updatedAt: -1})
    res.status(200).json(posts)
    
   } catch (error) {
    return next(new HttpError(error))
   }
   }


//====================GET SINGLE post ====================//
//GET:api/posts/:id
//UNPROTECTED
const getPost=async(req,res,next)=>{
   try {
    const postId=req.params.id
    const post=await postModel.findById(postId)
    if(!post){
        return next(new HttpError("Post not found",404))
    }

    res.status(200).json(post)
    
   } catch (error) {
    return next(new HttpError(error)) 
   }
}

//====================GET posts by CATEGORY ====================//
//GET:api/posts/categories/:category
//UNPROTECTED
const getCatPost=async(req,res,next)=>{
  try {
    const {category}=req.params
    const catPosts=await postModel.find({category}).sort({createdAt: -1})
    if(!catPosts){
        return next(new HttpError("No posts found in this category",404))
    }
    res.status(200).json(catPosts)
    
  } catch (error) {
    return next(new HttpError(error))
  }
   
}


//====================GET Author post ====================//
//GET:api/posts/users/:id
//UNPROTECTED
const getUserPosts=async(req,res,next)=>{
   try {
    const {id}=req.params
    const posts=await postModel.find({creator: id}).sort({createdAt: -1})
    res.status(200).json(posts)
    
   } catch (error) {
    return next(new HttpError(error))
    
   }
}

//====================Edit post ====================//
//PATCH:api/posts/:id
//PROTECTED
const editPost=async(req,res,next)=>{
    try {
        let fileName;
        let newFilename;
        let updatedPost;

        const postId=req.params.id
        let {title,description,category}=req.body

        if(!title || description < 12 || !category){
            return next(new HttpError("Please fill all fields",422))
        }

        //get oldpost from database
        const oldPost=await postModel.findById(postId)

        if(req.user.id == oldPost.creator){
        if(!req.files){

            updatedPost=await postModel.findByIdAndUpdate(postId,{title,category,description},{new:true})

        }else{
            

         
            //delete old image from uploads
            fs.unlink(path.join(__dirname,"..","uploads",oldPost.thumbnail),async(err)=>{
                if(err){
                    return next(new HttpError(err))
                }
            })

              //upload new thumbnail
              const {thumbnail}=req.files
              //check the file size
              if(thumbnail.size > 2000000){
                  return next(new HttpError("Thumbnail too big. Should be less than 2mb"))
              }
              fileName=thumbnail.name;
              let splittedFileName=fileName.split(".")
              newFilename=splittedFileName[0] + uuid() +  "." + splittedFileName[splittedFileName.length - 1]
              thumbnail.mv(path.join(__dirname,"..","uploads",newFilename),async(err)=>{
                  if(err){
                      return next(new HttpError(err))
                  }

              })
              //update post with new thumbnail
              updatedPost=await postModel.findByIdAndUpdate(postId,{title,category,description,thumbnail:newFilename},{new:true})
            }
        }
 

        if(!updatedPost){
            return next(new HttpError("Could't update post",400))
        }

        res.status(200).json(updatedPost)
        
        
    } catch (error) {
    return next(new HttpError(error))
        
    }
}

//====================Delete post ====================//
//DELETE:api/posts/:id
//UNPROTECTED
const deletePost=async(req,res,next)=>{
    try {
        const postId=req.params.id
        if(!postId){
            return next(new HttpError("Invalid post id"),400)
        }
        const post=await postModel.findById(postId)
        const fileName=post?.thumbnail;

        if(req.user.id == post.creator){
        //delete thumbnail from uploads folder
        fs.unlink(path.join(__dirname,"..","uploads",fileName),async(err)=>{
            if(err){
                 return next(new HttpError(error))
            }else{
                //delete post from database
                await postModel.findByIdAndDelete(postId)

                //find user and reduce the post count
                const currentUser=await userModel.findById(req.user.id)
                const userPostCount=currentUser?.posts - 1;
                await userModel.findByIdAndUpdate(req.user.id,{posts:userPostCount},{new:true})
                 res.status(200).json(`Post ${postId} deleted successfully`)

            }
        })
    }else{
        return next(new HttpError("Post couldn't be deleted"),403)
    }

    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports={createPost,getPosts,getPost,getCatPost,getUserPosts,editPost,deletePost}
