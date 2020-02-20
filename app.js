const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

//routes established in the placesRoutes middleware are accessible now.
//the first argument 'api/places' says that it will only route requests to placesRoutes if it begins with api/places
app.use('/api/places', placesRoutes);


app.listen(3000);