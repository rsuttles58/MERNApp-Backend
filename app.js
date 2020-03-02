const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//routes established in the placesRoutes middleware are accessible now.
//the first argument 'api/places' says that it will only route requests to placesRoutes if it begins with api/places
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req,res,next) => {
    const error = new HttpError('Count not find this route.', 404);
    throw error;
})
//if you pass four parameters in express, it will recognize this as an errorhandling middleware
//this code only executed when an error is yielded by a previous middleware
app.use((error,req,res,next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred'})
})
app.listen(5000);