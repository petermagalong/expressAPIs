const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {

    let error = {...err};
    error.message = err.message;
    //Log to console for dev
    console.log(err.stack.red);
    //console.log(Object.values(err.errors))
    // console.log("Nameeeeeeeeeeeeee ",err.name); //CastError
    // console.log(err.value); 617164c03013169506279abdd 


    //Mongoose Bad error id
    if(err.name === 'CastError')
    {
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    if(err.code === 11000)
    {
        const message = `Duplicated value`;
        error = new ErrorResponse(message,400);
    }

    if(err.name === `ValidationError`)
    {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message,400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;