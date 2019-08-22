const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//import routes
const authRoute = require('./routes/auth');

dotenv.config();
//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },() => 
    console.log('connected to DB')
    );

//middleware
app.use(express.json());



//import middleware
app.use('/api/user', authRoute);


app.listen(3000, () => console.log('Server up and running'));

