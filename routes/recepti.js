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


router.post('/recipe', verify, async (req, res) => {

  try {
    const { title, ingredients, description } = req.body
    const userEmail = req.user.email;
    const recept = await Recept.findOne({ title })
    if (recept) {
      console.log('postoji')
      res.status(400).send({ msg: "Recept alredy exist" })
    } else {

      await Recept.create({ title, ingredients, description, userEmail })
      res.sendStatus(200)
      console.log('recept kreiran')

    }

  } catch (err) { console.log(err) }


})


router.patch("/user/:email", async (req, res) => {
  try {
    const result = await User.updateOne(
      { email: req.params.email },
      { $addToSet: { items: req.body.buttonValue } }
    );
    console.log(req.params.email);
    res.send(result);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.send(error);
  }
});




router.get('/userItems/:email', verify, async (req, res) => {
  try {
    const { email } = req.params

    const userDb = await User.findOne({ email })
    console.log("Funkcija pozvana")
    res.send(userDb.items)

  } catch (error) {
    console.error(error);
    res.send(error);
  }


})



router.get('/userRecipe/:email', verify, async (req, res) => {


  const { email } = req.params
  const user = await User.findOne({ email });
  const userItems = user.items;
  console.log(userItems)
  const recepti = await Recept.find({});
  const matchedRecepti = [];
  recepti.forEach((recept) => {
    const { title, ingredients } = recept;
    const matchedIngredients = userItems.filter((item) => ingredients.includes(item));
    if (matchedIngredients.length > 3) {
      matchedRecepti.push({ title, ingredients });
    }
  });
  res.send(matchedRecepti);
});








module.exports = router;