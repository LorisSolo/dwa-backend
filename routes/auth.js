const { Router, response, request } = require("express");
const { create } = require("../Database/Schemas/User");
const User = require("../Database/Schemas/User");
const jwt = require('jsonwebtoken')
const { passwordHash, comparePassword, authenticateToken } = require('../utils/passhash');
//const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
const { Cookie } = require("express-session");
const Recepti = require("../Database/Schemas/Recepti");
require('dotenv').config()



const router = Router();





router.post("/login", async (req, res) => {
  try{
    console.log("pls")
    const { email, password } = req.body
    if (!email || !password) res.status(400).send({'message':'Bad Request'})
    let userDb = await User.findOne({ email })
    if (!userDb) return res.status(401).send({'message':'Unauthorised'})
    const isValid = comparePassword(password, userDb.password)
    if (!isValid) {
      console.log("kriva loz")
      return res.status(401).send({'message':'Unauthorised'})
    } else {
      console.log("token")
      const token = jwt.sign({ _id: userDb._id }, process.env.TOKEN_SECRET, {expiresIn: '60s' })
      console.log(token)
        
      res.cookie('jwt', token,
        {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "none", 
          secure: true
          })
          
      console.log("ajmoo")
      res.status(200).send({'message':'OK'})
    }

  }catch{(err)=>{console.log(err)}}



})


router.post('/logout', (req, res) => {
  res.cookie('jwt', '',
    { maxAge: 0 })

  res.send({ message: 'success' })
})



router.get("/user", async (req, res) => {

  try{
  const cookie = req.cookies['jwt']
    console.log(cookie)
  const claims = jwt.verify(cookie, process.env.TOKEN_SECRET)

  if (!claims) {
    return res.status(401).send({ message: 'anauthenticated' })
  }
  const userDb = await User.findOne({ _id: claims._id })
  const { password, ...data } = userDb.toJSON()
  res.send(data)
}catch (err){
  return res.status(401).send({ message: 'anauthenticated' })
}
})


router.get('/test',[authenticateToken],(req, res) => {

    res.send('ok')
  
})

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  const userDb = await User.findOne({ email })
  if (userDb) {
    res.status(400).send({ msg: "User alredy exist" })
    console.log('User postoji')
  } else {
    const hashedPassword = passwordHash(password)
    //console.log(hashedPassword)
    const newUsere = await User.create({ username, email, password: hashedPassword })
    res.sendStatus(200)
    console.log('User kreiran')
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