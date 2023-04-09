const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Database/Schemas/User');
const cookieParser = require('cookie-parser')

function passwordHash(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt)
}
function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash)
}



async function authenticateToken(email, password) {
    let userDb = await User.findOne({ email })
    if (userDb && userDb.password && comparePassword(password, userDb.password)) {
        delete userDb.password
        let token = jwt.sign({ email: userDb.email }, process.env.TOKEN_SECRET, { algorithm: "HS512", expiresIn: "1week" })

        return {
            token,
            email: userDb.email

        }


    } else {
        throw new Error("Cannot authenticate")
    }

}

function verify(req, res, next) {
    try {
        let authorization = req.headers.authorization.split(' ')
        let type = authorization[0]
        let token = authorization[1]

        if (type !== 'Bearer') {
            res.status(401).send({ msg: "nije bearer" })
        } else {

            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = decodedToken;
            return next()

        }
    } catch (e) {
        res.status(401).send()

    }
}



module.exports = {
    passwordHash,
    comparePassword,
    authenticateToken,
    verify
}