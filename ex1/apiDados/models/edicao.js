const mongoose = require('mongoose');

const MusicaSchema = new mongoose.Schema({
  id: String,
  link: String,
  título: String,
  país: String,
  compositor: String,
  intérprete: String,
  letra: String
}, { _id: false });

const EdicaoSchema = new mongoose.Schema({
  id: String,
  anoEdição: String,
  musicas: [MusicaSchema],
  organizacao: String,
  vencedor: String
}, { versionKey: false });

module.exports = mongoose.model('edicoes', EdicaoSchema);