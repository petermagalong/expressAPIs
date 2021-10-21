const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors')
const connectDB = require('./config/db')
//Route files
const bootcamps = require('./routes/bootcamps')

//load env
dotenv.config({ path: './config/config.env'});

//connecct to database
connectDB();


const app = express();

// const logger = (req, res, next) => {

// }
//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` .yellow.bold));

process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server & exit process 
    server.close(()=> process.exit(1));
})