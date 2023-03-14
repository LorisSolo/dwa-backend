const { Router, response } = require("express");
const { create } = require("../Database/Schemas/Recepti");
const Recept = require("../Database/Schemas/Recepti");
const { authenticateToken, verify } = require('../utils/passhash');
const jwt = require('jsonwebtoken');
const User = require("../Database/Schemas/User");


const multer = require('multer');
const { use } = require("./auth");
const router = Router();



router.get("/", verify, async (req, res) => {
    
      
            
         const svi = await Recept.find({})
        res.send(svi)
        
        
 
        

    
})


router.post('/dodajRecept', verify,  async (req, res) => {
    const { title, ingredients, description } = req.body
    const recept = await Recept.findOne({ title })
    if (recept) {
      console.log(recept)
      console.log('postoji')
        res.status(400).send({ msg: "Recept alredy exist" })
    } else {
    
           await Recept.create({ title, ingredients, description })
            res.sendStatus(200)
            console.log('recept kreiran')
        
    }
    
})


router.patch("/updateUser/:email",    async (req, res) => {
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

  router.delete("/deleteItem/:email/:item", async (req, res) => {
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




router.get('/getUserItems/:email', async (req, res) => {
try{
  const { email } = req.params

    const userDb = await User.findOne({ email })
    res.send(userDb.items)

} catch (error)  {
  console.error(error);
  res.send(error);
}
    

  })



  

  router.get('/getUserRecepti/:email',async (req, res) => {

    
      const { email }= req.params
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
  

  





/*
const Storage = multer.diskStorage({
    destination:'uploads',
    filename:(req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const upload = multer({
    storage:Storage
  }).single('testImage')

  router.get('/slika', (req,res) => {
    res.send('upload file')
  })

router.post ('/upload', (req, res) => {
    upload(req,res,(err) =>{
        if (err) {
            console.log(err)
        }else{
            const newImage = new ImageModel ({
                //name: req.body.name,
                image:{
                    data:req.file.filename,
                    contentType: 'image/png'
                }
            })
            newImage.save()
            .then (()=>res.send('successfully'))
            .catch((err)=> console.log(err))
        }
    })
})
*/

module.exports = router;