const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
require("dotenv").config()
const upload=require("express-fileupload")

const userRoutes=require("./router/user.route")
const postRoutes=require("./router/posts.route")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

const app=express()

app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true,origin:process.env.FRONTEND_URL}))
app.use(upload())
app.use("/uploads",express.static(__dirname + '/uploads'))

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)


app.use(notFound)
app.use(errorHandler)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to DB")
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
}).catch(()=>{
    console.log("Error connecting to DB")
})




// MT7PFxHSoCFbNf9B