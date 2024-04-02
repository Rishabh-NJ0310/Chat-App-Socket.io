import express from 'express';
import authRoutes from './src/routes/authRoutes.js'
import connection  from './src/database/Connection.js';
import messageRoutes from './src/routes/messageRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const Port = process.env.PORT || 5000;

//root route
app.get('/', (req,res)=>{
    res.send('server is ready');
})

app.use(express.json());
app.use(cookieParser());

// auth routes
app.use("/api/auth", authRoutes);

//message route
app.use("/api/messages", messageRoutes);

//User routes
app.use("/api/users", userRoutes);

app.listen(Port, () => {
    connection();
    console.log(`Server is running on http://localhost:${Port}`);
})