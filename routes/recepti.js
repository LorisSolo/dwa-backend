const { Router, response } = require("express");
const { create } = require("../Database/Schemas/Recepti");
const Recept = require("../Database/Schemas/Recepti");
const { verify } = require('../utils/passhash');
const jwt = require('jsonwebtoken');
const User = require("../Database/Schemas/User");

const multer = require('multer');
const { use } = require("./auth");
const router = Router();


router.get("/", verify, async (req, res) => {

  const svi = await Recept.find({})
  res.send(svi)

})


router.post('/', verify, async (req, res) => {

  try {
    const { title, ingredients, description } = req.body
    const userEmail = req.user.email;
    const recept = await Recept.findOne({ title })
    if (recept) {
      res.status(400).send({ msg: "Recipe alredy exist" })
    } else {

      await Recept.create({ title, ingredients, description, userEmail })
      res.sendStatus(200)
    }

  } catch (err) { console.log(err) }


})


module.exports = router;