const express = require('express');
const router = express.Router();
const persona = require("../controladores/persona");
const passport = require('../passport.js')


router.get("/", passport.authenticate('jwt', {session: false}), persona.getAll );
router.get("/:id", passport.authenticate('jwt', {session: false}), persona.getById);
router.post("/", passport.authenticate('jwt', {session: false}), persona.add);
router.put("/:id", passport.authenticate('jwt', {session: false}), persona.update);
router.delete("/:id", passport.authenticate('jwt', {session: false}), persona.deleteElement);


module.exports = router;