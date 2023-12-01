const express = require('express');
const router = express.Router();
const proyecto = require("../controladores/proyecto");
const passport = require('../passport.js')


router.get("/", passport.authenticate('jwt', {session: false}), proyecto.getAll);
router.get("/:id", passport.authenticate('jwt', {session: false}), proyecto.getById);
router.post("/", passport.authenticate('jwt', {session: false}), proyecto.add);
router.put("/:id", passport.authenticate('jwt', {session: false}), proyecto.update);
router.delete("/:id", passport.authenticate('jwt', {session: false}), proyecto.deleteElement);



module.exports = router;