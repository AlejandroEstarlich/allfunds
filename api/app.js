'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Cargar files rutas
var article_routes = require('./routes/article');

// Cargar Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// Cargar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  console.log(req.file);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

// Ruta de prueba
app.get('/test', (req, res) => {
  res.status(200).send({
    message: "Test de servidor NodeJS"
  });
});

// Rutas
app.use('/api', article_routes);



// Exportar la configuración
module.exports = app;