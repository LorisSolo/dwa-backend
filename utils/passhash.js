const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function passwordHash (password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt)
}
function comparePassword(raw, hash){
    return bcrypt.compareSync(raw, hash)
}



function authenticateToken(req, res, next) {
    try{
        const cookie = req.cookies['jwt']
        console.log(cookie)
        if(!cookie){
            res.json({'msg': 'nema cookiea'})
        }
        if(jwt.verify(cookie, process.env.TOKEN_SECRET)) {
            console.log("dobar cookie")
            next()
        }
        
    

    }catch{(e)=> res.send(e)}
    
}
    



module.exports = {
    passwordHash,
    comparePassword,
    authenticateToken
}