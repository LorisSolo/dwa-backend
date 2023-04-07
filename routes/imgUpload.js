const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const multer = require('multer');
const fs = require("fs");
const User = require('../Database/Schemas/User');
const Recept = require("../Database/Schemas/Recepti");
const Recepti = require('../Database/Schemas/Recepti');
const { verify } = require('../utils/passhash');

const Storage = multer.diskStorage({
    destination: 'temp',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: Storage }).single('picture');

router.patch('/editPicture/:id', verify, async (req, res) => {

        let recept = await Recept.findOne({ _id: req.params.id })
        console.log(recept)
        
         if (req.user.email !== recept.userEmail) {
            console.log(recept + "  req.user.email !== recept.userEmail ");
            console.log(recept.userEmail, req.user.mail)
            return res.sendStatus(403); 
        
    
    }
       
        upload(req, res, (err) => {

            try {
                console.log(req.file.filename);
            } catch (e) { return res.sendStatus(406); }

            if (err) {
                console.log(err);
            } else {
                const img = sharp("temp/" + req.file.filename)
                    .resize({ height: 300, width: 300 }).toBuffer().then(dt => {
                        const image = {
                            name: req.body.name,
                            image: {
                                data: dt,
                                contentType: 'image/png'
                            }
                        };
                        recept.picture = image;
                        recept.save().then(result => res.sendStatus(200)).catch(err => console.log(err));

                        fs.unlink("temp/" + req.file.filename, (err) => {
                            if (err) console.log(err);
                        });
                    });
            }
        });

   
});

module.exports = router;