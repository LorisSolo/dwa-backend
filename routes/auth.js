const { Router, response, request } = require("express");
const { create } = require("../Database/Schemas/User");
const User = require("../Database/Schemas/User");
const jwt = require('jsonwebtoken')
const { passwordHash, comparePassword } = require('../utils/passhash');
//const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
const { Cookie } = require("express-session");



const router = Router();





router.post("/login", async (req, res) => {
  console.log("pls")
  const { email, password } = req.body
  if (!email || !password) res.sendStatus(400)
  let userDb = await User.findOne({ email })
  if (!userDb) return res.sendStatus(401)
  const isValid = comparePassword(password, userDb.password)
  if (!isValid) {
    console.log("kriva loz")
    return res.sendStatus(401)
  } else {
    const token = jwt.sign({ _id: userDb._id }, 'secret')
    res.cookie('jwt', token,
      {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })

    res.sendStatus(200)
  }


})


router.post('/logout', (req, res) => {
  res.cookie('jwt', '',
    { maxAge: 0 })

  res.send({ message: 'success' })
})



router.get("/user", async (req, res) => {

  try{

  
  const cookie = req.cookies['jwt']

  const claims = jwt.verify(cookie, 'secret')

  if (!claims) {
    return res.status(401).send({ message: 'anauthenticated' })
  }
  const userDb = await User.findOne({ _id: claims._id })
  const { password, ...data } = await userDb.toJSON()
  res.send(data)
}catch (err){
  return res.status(401).send({ message: 'anauthenticated' })
}
})


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  const userDb = await User.findOne({ email })
  if (userDb) {
    res.status(400).send({ msg: "User alredy exist" })
    console.log('postoji')
  } else {
    const hashedPassword = passwordHash(password)
    //console.log(hashedPassword)
    const newUsere = await User.create({ username, email, password: hashedPassword })
    res.sendStatus(200)
    console.log('kreiran')
  }

})


/*
router.patch ("/:username", async(req, res) =>{
    const item = req.body
    //const { username } = req.params
    const doc = await User.findOne({  username: "abcdef" })
    doc.items.push(item)
    await doc.save()
    res.send(201)
})





router.patch("/:username",(req, res) => {
  
  const { username } = req.params

  
    User.updateMany(
      { username }, { $push: { items : req.body.items}},
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
         
        
      
    );
    console.log(User)
  });
*/
module.exports = router;