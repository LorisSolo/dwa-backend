const { Router, response } = require("express");
const { create } = require("../Database/Schemas/Recepti");
const Recept = require("../Database/Schemas/Recepti");
const { authenticateToken } = require('../utils/passhash');

const multer = require('multer')
const router = Router();



router.get("/", [authenticateToken],  async (req, res) => {
 
        const svi = await Recept.find({})
        res.send(svi)

    
})


router.post('/dodajRecept', async (req, res) => {
    const { title, ingredients, description } = req.body
    const recept = await Recept.findOne({ title })
    if (recept) {
        res.status(400).send({ msg: "Recept alredy exist" })
    } else {
    
           await Recept.create({ title, ingredients, description })
            res.sendStatus(200)
            console.log('recept kreiran')
        
    }
    
})
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