const router = require('express').Router();
const User = require('../models/User');

//hashing and salting
const jwt = require('jsonwebtoken');

//getting secret strings we can use to encrypt information
require('dotenv').config();




//View all accounts

router.post('/getaccounts', async(req, res) => { 

    const {token} = req.body;

    //verifying the token

    try{const user = jwt.verify(token, process.env.jwt);
        const __id = user.id;

        //we find the specific user we need and then return all of their accounts

        const request = await User.findOne({_id: __id})  
        const data = JSON.stringify(request)

        //return response message
        return res.json({status:'ok', message: 'Accounts', current_accounts: data})
    }

    catch(error){
        res.json({status:'error', message: 'Invalid'})
        console.log(error)
    }
})





//Create an account entry

router.post('/createaccount', async(req, res) => { 

    const {token, account} = req.body;

        function getRandomID(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }

        // we allocate a random ID to the account we are adding, we can use this to identify the account if we need to do an action
    account.id = String(getRandomID(1, 1000000));
    console.log(account);

    try{const user = jwt.verify(token, process.env.jwt);
        const identifier = user.id;

        // notice that here we are not salting and hashing anything, 
        // this is because the user/password entry information is already submitted as AES encrypted information with the master password
        // when the user submits this account to their account manager

        const request = await User.updateOne({_id : identifier}, {$push: { accounts: account }}) //updating one user with the new hashed password
        res.json({status:'ok', message: 'Succesfully added', acccount_added: account})
    }

    catch(error){
    res.json({status:'error', message: 'Invalid'})
    console.log(error)
    }
})






//Delete an account

router.post('/deleteaccount', async(req, res) => { 

    const {token, account_id} = req.body;

    //verifying if the token is correct
    try{const user = jwt.verify(token, process.env.jwt);
        const __id = user.id;
        const currentU = user.username;

    //finding our user in the database
    const acc = await User.find({ "accounts.id": { $eq: account_id }})
    console.log(acc[0].username)

    //if the username inside the token does not match the user the object belongs to we let the person know
    //he is up to something sketchy
    //this is a security measure where an unauthorised person can't edit someone elses account by having its ID

    if (acc[0].username !== currentU){
       return res.json({status:'error', error: 'Dont do that.'})
    }

    const del = await User.update(
         { },
         { $pull: { accounts: { id: account_id } } }
       )

    
    res.json({status:'ok', message: 'Deleted succesfully'})
    }

    catch(error){
        console.log(error)
        return res.json({status:'error', message: error})
    }


})






//Modify an account

router.post('/modifyaccount', async(req, res) => { 
    

    //verify the token
        const {token, account_id, modified_account} = req.body;
         try{const user = jwt.verify(token, process.env.jwt);
             const __id = user.id;
             const currentU = user.username;
             const acc = await User.findOne({_id: __id})
             console.log(acc.username)
     
     
         if (acc.username !== currentU){
           return res.json({status:'error', message: 'Dont do that.'})
         }
     
     
    
         //we introduce the new information instead of the old one after we find this specific array
         //mongoose has quite specific syntax, we use $ here to select individual keys we can use for this operation


        const modify = await User.findOneAndUpdate({accounts: {$elemMatch: {id: account_id}}},
            {$set: {'accounts.$.account_name': modified_account.account_name,
                    'accounts.$.name': modified_account.name,
                    'accounts.$.password': modified_account.password,
                    'accounts.$.description': modified_account.description,
                }}, 
            {'new': true, 'safe': true, 'upsert': true});
    
            return res.json({status:'ok', message: 'Modified succesfully'})
         }
     

         catch(error){
             console.log(error)
                return res.json({status:'error', message: error})
         }
     
    
    
     })




//export the routing
module.exports = router;