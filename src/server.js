const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const api = require('./api');

//Connection to DB
const connection = mysql.createConnection({
    host     : '157.90.212.183',
    user     : 'mentcol_alertador',
    password : 'G7.WTM.41kp',
    database : 'mentcol_alertas'
});

connection.connect();

const port = process.env.PORT || 8080;

const app = express()
  .use(cors())
  .use(express.json())
  .use(api(connection));

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
