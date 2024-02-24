const jwt = require('jsonwebtoken');
const secretKey = 'V is the key';

function generateToken(payload, expiresIn = '1m') {
    return jwt.sign(payload, secretKey, { expiresIn })
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey)
    } catch (error) {
        return null
    }
}



module.exports = {
    generateToken,
    verifyToken,
    // authenticateToken
}