const { Router, response } = require("express");
const { create } = require("../Database/Schemas/Recepti");
const Recept = require("../Database/Schemas/Recepti");
const { verify } = require('../utils/passhash');
const jwt = require('jsonwebtoken');
const User = require("../Database/Schemas/User");

const multer = require('multer');
const { use } = require("./auth");
const router = Router();



router.patch("/:email", async (req, res) => {
    try {
      const result = await User.updateOne(
        { email: req.params.email },
        { $addToSet: { items: req.body.buttonValue } }
      );
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  });
  
  router.delete("/item/:email/:item", verify, async (req, res) => {
    try {
      const result = await User.updateOne(
        { email: req.params.email },
        { $pull: { items: req.params.item } }
      );
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  });
  
  
  
  
  router.get('/items/:email', verify, async (req, res) => {
    try {
      const { email } = req.params
  
      const userDb = await User.findOne({ email })
      res.send(userDb.items)
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  
  
  })
  
  
  
  router.get('/recipes/:email', verify, async (req, res) => {
  
  
    const { email } = req.params
    const user = await User.findOne({ email });
    const userItems = user.items;
    const recepti = await Recept.find({});
    const matchedRecepti = [];
    recepti.forEach((recept) => {
      const { title, ingredients } = recept;
      const matchedIngredients = userItems.filter((item) => ingredients.includes(item));
      if (matchedIngredients.length > 3) {
        matchedRecepti.push({ title });
      }
    });
    res.send(matchedRecepti);
  });
  
  
  
  
  
  
  
  
  module.exports = router;