import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors({
    origin: 'http://localhost:5173', // Ensure this matches your frontend's origin
    credentials: true,              // Allow credentials (cookies, auth)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.use(express.json({limit : "16kb"}))  //To get the json data and setted the limit of it
app.use(express.urlencoded({extended : true, limit : "16kb"})) // for url encoded just like ?=ankit+dwivedi
app.use(express.static("public")) //to serve the files to all just like favicon
app.use("/uploads", express.static("uploads"));


app.use(cookieParser())  


//Routes Import
import studentRouter from './routes/student.routes.js'
import adminRouter from './routes/admin.route.js'
// import teacherRouter  from './routes/teacher.route.js'
// import chatRouter from './routes/chatroom.route.js'



//Routes Declaration

app.use("/api/v1/students", studentRouter)
app.use("/api/v1/admin", adminRouter)
// app.use("/api/v1/teachers", teacherRouter)
// app.use("/api/v1/chats", chatRouter)









export { app }