//Archivo de prueba de autenticacion token.
const express = require('express');
const router = express.Router();
const passport = require('../passport.js')


router.get('/', passport.authenticate('jwt',{session: false}),(req,res) => {
  res.end("Hola Usuario Autenticado");
});

module.exports = router;