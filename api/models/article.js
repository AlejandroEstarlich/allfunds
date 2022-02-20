'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
  title: String,
  subtitle: String,
  content: String,
  image: String,
  author: String,
  is_archived: Boolean,
  archived_date: { type: Date },
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', ArticleSchema);
// MongoDB nos crea la colección articles y guarda los objetos de este tipo