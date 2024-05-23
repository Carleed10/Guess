const express = require('express');
const dbConnect = require('./Config/dbConnect');
const userRouter = require('./Routes/userRoute');
const app = express()
const env = require('dotenv').config()

app.use(express.json())
app.use('/api/user' , userRouter)

let PORT = 5000
app.listen(PORT, ()=>{
    console.log(`App is running on http://localhost:${PORT}`);
})

dbConnect()