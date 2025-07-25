import express from 'express';
import cors from 'cors';
import mongoDB from './config/mongodb.js';
import dotenv from 'dotenv';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// App config
const app = express();
const port = process.env.PORT || 4000;
mongoDB()
connectCloudinary()

// Middlewares
app.use(express.json());
app.use(cors({
    origin: "https://doctor-frontend-omega.vercel.app/",  // 👈 yahan apna actual deployed frontend URL daalo
    credentials: true  // agar cookies use ho rahi hain, warna hata bhi sakte ho
}));


// API endpoint
app.get("/", (req, res) => {
    res.send("API is working!")
});
app.get("/home",(req,res)=>{
    res.send("apppasjdbbf")
})

//api end point
app.use("/api/admin",adminRouter);
// localhost:4000/api/admin/add-doctor


app.use("/api/doctor",doctorRouter);

app.use("/api/user",userRouter);


// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
