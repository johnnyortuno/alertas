const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const api = require('./back_app/api');

//Connection to DB
const connection = mysql.createConnection({
    host     : '186.3.156.52',
    user     : 'proyectos',
    password : 'proyectos',
    database : 'alertas'
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
