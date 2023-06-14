import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import fbRouter from './routes/fbRouter.js';
import { mongoConnect } from './config/db.js';
import { localMiddleware } from './midddleware/localsMiddleware.js';

//environment variable
dotenv.config();
const port = process.env.PORT || 8080

//init express
const app = express();

//set form data
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//session setup
app.use(session({
    secret : 'uH4J3EvsfVFRHtcF',
    resave : false,
    saveUninitialized : true 
}))

//setup cookie parser 
app.use(cookieParser());

//create static folder
app.use(express.static('public'));

// ejs setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout','layouts/app');

// locals middleware setup
app.use(localMiddleware)

// fb Router
app.use(fbRouter);


//server listener
app.listen(port,()=>{
    mongoConnect()
    console.log(`Server is running on port ${port}`.bgBlue);
})