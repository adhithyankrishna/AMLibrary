// const jwt = require('jsonwebtoken')
// const userData = {UserId: 1, name: 'first'}
// const SecretKey = 'V is the key'
// const Timer = {expiresIn:'1h'}

// const token = jwt.sign(userData,SecretKey,Timer)
// const decode = jwt.verify(token, SecretKey, (error) => {if(error) console.log('Invalid key')})

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.sendStatus(401); // Unauthorized
//     }

//     jwt.verify(token, secretKey, (err, user) => {
//         if (err) {
//             return res.sendStatus(403); // Forbidden
//         }
//         req.user = user;
//         next();
//     });
// };

// app.get('/protected', authenticateToken, (req, res) => {
//     res.json(req.user);
// });

// app.listen(3000)

// otherFile.js

const jwtUtils = require('./authenticateToken');
const express = require('express')
const app = express()
// const DB = require('./DB')


const CreateToken = (userId,name,age,email,password) => {
        const payload = { userId: userId, username: name, age: age, email: email, password: password };
        const token = jwtUtils.generateToken(payload);

        // console.log('Generated Token:', token);
        const decoded = jwtUtils.verifyToken(token);
        return token
        // DB.PersonalCollection.insertOne({'Token':token, 'decoded':decoded})
 

        // if (decoded) {
        //     // console.log('Decoded Payload:', decoded);
        // } else {
        //     console.log('Token verification failed.');
        // }

        // Authenticate requests using middleware
        // app.get('/protected', jwtUtils.authenticateToken, (req, res) => {
        //     res.json(req.user);
        // });
}

module.exports = CreateToken
