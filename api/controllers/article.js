'use strict'

var validator = require('validator');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');

var controller = {
  test: (req, res) => {
    return res.status(200).send({ message: 'Testing de controlador' });
  },

  // Método para guardar artículos
  save: (req, res) => {
    // Recoger parámetros por post
    var params = req.body;

    // Validar datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_subtitle = !validator.isEmpty(params.subtitle);
      var validate_content = !validator.isEmpty(params.content);
      var validate_content = !validator.isEmpty(params.author);

    } catch(err) {
      return res.status(200).send({ 
        status: 'error',
        message: 'Faltan datos por enviar'
      });
    }

    if(validate_title && validate_subtitle && validate_content) { 
      // Crear objeto a guardar (artículo)
      var article = new Article();

      // Asignar valores
      article.title = params.title;
      article.subtitle = params.subtitle;
      article.content = params.content;
      article.image = null;
      article.author = params.author;
      article.is_archived = false;

      // Guardar objeto
      article.save((err, articleStored) => {
        if(err || !articleStored) {
          return res.status(404).send({ 
            status: 'error',
            message: 'Error al guardar el artículo' 
          });
        }

        // Devolver una respuesta
        return res.status(200).send({ 
          status: 'success',
          article: articleStored 
        });
      });
    } else {
      return res.status(200).send({ 
        status: 'error',
        message: 'Datos no válidos' 
      });
    }
  },

  uploadImage: (req, res, next) => {
    // Recoger fichero
    var file_name = 'Imagen no subida';

    if(!req.file) {
      return res.status(404).send({
        status: 'error',
        message: file_name
      });
    }

    // Nombre del archivo
    var file_path = req.file.filename;

    // Comprobar el mimetype, si no es una imagen, borrar
    var file_mime = req.file.mimetype;

    if(file_mime != 'image/png' && file_mime != 'image/jpg' && file_mime != 'image/gif' && file_mime != 'image/jpeg') {
      // Borrar file
      fs.unlink(req.file.path, (err) => {
        return res.status(200).send({
          status: 'error',
          message: 'Extensión no válida'
        });
      });
    } else {
      var article_Id = req.params.id;

      Article.findByIdAndUpdate(article_Id, {image: file_path}, {new: true}, (err, articleUpdated) => {
        if(err || !articleUpdated) {
          return res.status(200).send({
            status: 'error',
            message: 'Error al guardar la imagen'
          });
        }

        return res.status(200).send({
          status: 'success',
          article: articleUpdated
        });
      }); 
    }
  },

  getImage: (req, res) => {
    var image = req.params.image;

    var path_file = './uploads/articles/'+image;
    

    fs.exists(path_file, (exist) => {
      if(exist) {
        return res.sendFile(path.resolve(path_file));
      } else {
        return res.status(404).send({
          status: 'error',
          message: 'La imagen no existe'
        })
      }
    });
  },

  // Método para devolver lista de artículos nuevos
  getNewArticles: (req, res) => {

    // Find para encontrar los artículos
    Article.find({"is_archived": false}).sort('-_id').exec((err, articles) => {
      if(err) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver artículos'
        });
      }

      // Comprobar que existen artículos
      if(!articles || articles.length <= 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No existen artículos'
        });
      }

      // Devolver artículos
      return res.status(200).send({
        status: 'success',
        articles
      });
    });
  },

  // Método para devolver lista de artículos archivados
  getArchivedArticles: (req, res) => {
    // Find para encontrar los artículos
    Article.find({"is_archived": true}).sort('-_id').exec((err, articles) => {
      if(err) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver artículos'
        });
      }

      // Comprobar que existen artículos
      if(!articles || articles.length <= 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No existen artículos',
        });
      }

      // Devolver artículos
      return res.status(200).send({
        status: 'success',
        articles
      });
    });
  },

  // Obtener detalle de un artículo
  getArticle: (req, res) => {
    // Recoger id de la Url
    var article_Id = req.params.id;
    
    // Comprobar que existe el artículo con ese id
    if(!article_Id || article_Id == null) {
      return res.status(404).send({
        status: 'error',
        message: 'No existe este artículo'
      });
    }

    // Buscar artículo
    Article.findById(article_Id, (err, article) => {
      if(err) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver artículo'
        });
      }

      if(!article) {
        return res.status(404).send({
          status: 'error',
          message: 'No existe este artículo'
        });
      }

      // Devolver artículo en json
      return res.status(200).send({
        status: 'success',
        article
      });
    });
  },

  // Método para actualizar un artículo
  update: (req, res) => {
    // Recoger id de la Url
    var article_Id = req.params.id;

    // Recoger datos por put
    var params = req.body.article;

    // Validar
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_subtitle = !validator.isEmpty(params.subtitle);
      var validate_content = !validator.isEmpty(params.content);
    } catch(err) {
      return res.status(200).send({
        status: 'error',
        message: 'Faltan datos por enviar'
      });
    }

    if(validate_title && validate_subtitle && validate_content) {
      // Hacer un find and update para actualizar
      Article.findByIdAndUpdate(article_Id, params, {new: true}, (err, articleUpdated) => {
        if(err) {
          return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar'
          });
        }

        if(!articleUpdated) {
          return res.status(404).send({
            status: 'error',
            message: 'No existe el artículo'
          });
        }
        
        if(articleUpdated) {
          //Comprobamos si se ha actualizado la imagen
          if(req.body.img) {
            var path_file = './uploads/articles/'+articleUpdated.image;
            fs.unlink(path_file, (err) => {});
          }

          // Actualizar fecha de actualización
          articleUpdated.updated_at = new Date();

          // Devolver el artículo actualizado
          return res.status(200).send({
            status: 'success',
            article: articleUpdated
          });
        }
      });

      
    } else {
      // Mensaje de error
      return res.status(200).send({
        status: 'error',
        message: 'Validación incorrecta'
      });
    }
  },

  delete: (req, res) => {
    // Recoger id de la Url
    var article_Id = req.params.id;

    // Comprobar que el artículo existe
    if(!article_Id || article_Id == null) {
      return res.status(404).send({
        status: 'error',
        message: 'No existe este artículo'
      });
    }

    // Buscar el artículo
    Article.findByIdAndDelete(article_Id, (err, articleDeleted) => {
      if(err) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al borrar'
        });
      }

      if(!articleDeleted) {
        return res.status(404).send({
          status: 'error',
          message: 'No existe este artículo'
        });
      }

      var path_file = './uploads/articles/'+articleDeleted.image;
      fs.unlink(path_file, (err) => {
      });

      // Devolver artículo borrado
      return res.status(200).send({
        status: 'deleted',
        article: articleDeleted
      });
    });
  },

  searchArticles: (req, res) => {
    // Sacar el string para buscar
    var search_string = req.params.searchParam;

    // Find para encontrar los artículos
    Article.find({"$or": [
      {"title": {"$regex": search_string, "$options": "i"}},
      {"subtitle": {"$regex": search_string, "$options": "i"}},
      {"content": {"$regex": search_string, "$options": "i"}},
    ]}).sort('-_id').exec((err, articles) => {
      if(err) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver artículos'
        });
      }
      // Comprobar que existen artículos
      if(!articles || articles.length <= 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No existen artículos'
        });
      }
      // Devolver artículos
      return res.status(200).send({
  
        status: 'success',
        articles
      });
    });
  },

  // Método para actualizar un artículo
  archive: (req, res) => {
    // Recoger id de la Url
    var article_Id = req.params.id;

    // Recoger datos por put
    var params = {is_archived: true};

    // Validar
    if(article_Id) {
      // Hacer un find and update para actualizar
      Article.findByIdAndUpdate(article_Id, params, {new: true}, (err, articleUpdated) => {
        if(err) {
          return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar'
          });
        }

        if(!articleUpdated) {
          return res.status(404).send({
            status: 'error',
            message: 'No existe el artículo'
          });
        }
        
        if(articleUpdated) {
          // Actualizar fecha de actualización
          articleUpdated.updatedAt = new Date();
          articleUpdated.archived_date = new Date();

          // Devolver el artículo actualizado
          return res.status(200).send({
            status: 'archived',
            article: articleUpdated
          });
        }
      });

      
    } else {
      // Mensaje de error
      return res.status(200).send({
        status: 'error',
        message: 'Validación incorrecta'
      });
    }
  },


} // END CONTROLLER

module.exports = controller;