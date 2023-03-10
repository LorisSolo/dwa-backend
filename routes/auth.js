const { Router, response, request } = require("express");
const { create } = require("../Database/Schemas/User");
const User = require("../Database/Schemas/User");
const jwt = require('jsonwebtoken')
const { passwordHash,  authenticateToken, verify } = require('../utils/passhash');
//const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
const { Cookie } = require("express-session");
const Recepti = require("../Database/Schemas/Recepti");
require('dotenv').config()



const router = Router();





router.post("/login", async (req, res) => {
  const userDb = req.body;
  try {
    let result = await authenticateToken(userDb.email, userDb.password);
    
    
    res.cookie("token", result.token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: false, 
      secure: true, 
      sameSite: true
    });
    
    res.send(result);
    
  } catch (e) {
    res.status(403).json({ error: e.message });
  }
});


router.get('/test1', verify,  (req, res) => {

    res.json({message: 'Ovo je tajna'})
  
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
    const newUser = await User.create({ username, email, password: hashedPassword })
    res.status(200).send({msg: 'OK'})
    console.log('User kreiran')
  }

})


router.get('/getUser/:email', async (req, res) =>{

  const { email } = req.params

  const UserDb = await User.findOne( { email } )
  res.send(UserDb)

})




module.exports = router;