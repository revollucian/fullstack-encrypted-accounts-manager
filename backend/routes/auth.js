const router = require('express').Router();
const User = require('../models/User');

//hashing and salting
const bcrypt = require('bcryptjs');

//hashing and salting
const jwt = require('jsonwebtoken');

//getting secret strings we can use to encrypt information
require('dotenv').config();





// SOME IMPORTANT INFROMATION ABOUT JWT TOKENS

// JSON Web Tokens are formatted in such a way where we can save both PUBLIC and PRIVATE information inside

// such as: an ID or a username,

// they are formatted something like 

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXX

// ^this part is ID & user       ^this is ENCRYPTED payload   ^metadata

// all 3 parts are encoded with Base64 on top of being encrypted (note only the middle part is encrypted here, that is the payload)



// We are using a basic API for functions that interact with our database, this model of application, although not quite enterprise level secure, should be quite rugged.







//register function

router.post('/register', async(req, res) => { 

    const { username, email, password: plainTextPassword, m_password: plainTextMasterpassword} = req.body;


    // THIS IS EXTREMELY IMPORTANT, here we are HASHING and SALTING both our password and masterpassword

    const password = await bcrypt.hash(plainTextPassword, 10)
    const master_password = await bcrypt.hash(plainTextMasterpassword, 10)

    //putting in some checks to make sure the details arent the wrong type or too short

    if(username.length < 1 || typeof username !== 'string' ){
        return res.json({status:'error', message:'Incorrect username format'})
    }
    if(plainTextPassword.length < 6){
        return res.json({status:'error', message:'Password too short'})
    }

    // we talk to Mongo in order to create a user
  
    try{const response = await User.create({
            username,
            email,
            password,
            master_password
        })
        return res.json({ status: 'ok', message: 'User created'})


        //catching different errors, 11000 means that a unique field has already been used somewhere

    }
    catch(error){

        if(error.code === 11000){
            return res.json({ status: 'error', message: 'Username or email already used'})
        }
        return res.json({ status: 'error'})
    }


});


//login function

router.post('/login', async(req, res) => { 

    //get our information
    const { username, password } = req.body;

    //find our user in Mongo
    const user = await User.findOne({ username }).lean()

    if(!user){
        return res.json({status: 'error', error: 'Invalid'})
    }

    //compare the passwords, if its succesful we deliver a JWT ecrypted payload with a secret

    if(await bcrypt.compare(password, user.password)){

        //as mentioned before we can add public information to the JSON token,
        //below is the process of signing the token with the user ID and username,
        //followed by the payload information that is encrypted with process.env.jwt - this is the secret encryption string, 
        //only the server knows this string, no one else.

    
        const jwt_token = jwt.sign({ id: user._id, username: user.username}, process.env.jwt)
        return res.json({status: 'ok', token: jwt_token})
    }

    res.json({status:'error', error: 'Invalid'})
});



//changing a master password
 
router.post('/masterchange', async(req, res) => { 
        const {token, old_password, m_password } = req.body;

    
        // might notice a trend, we verify the token each time we perform any action
        // we only use the username/password for the login, everything else is validated using the token


        try{const user = jwt.verify(token, process.env.jwt);
            const __id = user.id;

            // we again hash and salt the new master password

            const hashed = await bcrypt.hash(m_password, 10)
            const acc = await User.findOne({_id : __id}) //updating one user with the new hashed password

            //here we use bcrypt to compare the old password to the password we already have in our database, 
            //if its true then we go ahead and

             if(await bcrypt.compare(old_password, acc.master_password)){

                console.log(old_password)

                //update our user with the new password

                await User.updateOne({_id : __id}, {$set:{ master_password: hashed }}) //updating one user with the new hashed password
                return res.json({status:'ok', message: 'Succesfully updated'})
             }
             return res.json({status:'error', message: 'Error'})
        }
        catch(error){
            return res.json({status:'error', message: 'Invalid'})
     }
     })
     
     

    //validate a master password
    
    router.post('/mastervalidate', async(req, res) => { 
        const {token, m_password } = req.body;
    
        try{const user = jwt.verify(token, process.env.jwt);
            const __id = user.id;
            const acc = await User.findOne({_id : __id}) //finding one user with this specific password

            //similarly to above here we are validating if the master password exists in this users object
            //however, this time we are not changing anything, we just say "Correct" if the password is in fact there

             if(await bcrypt.compare(m_password, acc.master_password)){
                console.log(acc)
                return res.json({status:'ok', message: 'Correct'})
             }
        }
            catch(error){
            res.json({status:'error', message: 'Invalid'})
            console.log(error)
        }
     return res.json({status:'error', message: 'Invalid'})
    })
    





    //changing a password

    router.post('/changepassword', async(req, res) => { 
        const {token, npassword } = req.body;


        //verifying the JSON token provided by the user
        try{const user = jwt.verify(token, process.env.jwt);
            const __id = user.id;

            //hashing and salting our password before we introduce it into our database in place of the old one
            const hashed = await bcrypt.hash(npassword, 10)
            await User.updateOne({__id}, {$set:{ password: hashed }}) //updating one user with the new hashed password
            res.json({status:'ok', message: 'Succesfully updated'})
        }
        catch(error){
            
        res.json({status:'error', message: 'Invalid'})
        console.log(error)

    }
    })



//export the routing
module.exports = router;