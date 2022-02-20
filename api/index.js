'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = 3800;

// CONEXIÓN DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/prueba', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          console.log("Prueba Database conectado");

          // Crear server
          app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:" + port);
          })
        })
        .catch(err => console.log(err));