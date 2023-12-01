const express = require('express');
const router = express.Router();
const donador = require("../controladores/donador");
const passport = require('../passport.js')


router.get("/", passport.authenticate('jwt', {session: false}), donador.getAll);
router.get("/:id", passport.authenticate('jwt', {session: false}), donador.getById);
router.post("/", passport.authenticate('jwt', {session: false}), donador.add);
router.put("/:id", passport.authenticate('jwt', {session: false}), donador.update);
router.delete("/:id", passport.authenticate('jwt', {session: false}), donador.deleteElement);


module.exports = router;