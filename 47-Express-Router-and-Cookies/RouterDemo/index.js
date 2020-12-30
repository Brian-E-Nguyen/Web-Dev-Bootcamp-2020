const express = require('express');
const app = express();
const shelterRoutes = require('./routes/shelters');
const dogRoutes = require('./routes/dogs');

const portNumber = 3000;

app.use('/shelter', shelterRoutes);
app.use('/dogs', shelterRoutes);

app.listen(portNumber, () => {
    console.log('Serving app on localhost:3000')
})