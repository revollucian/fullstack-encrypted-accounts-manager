
const mongoose =  require('mongoose');


const schemaUser = new mongoose.Schema({

    username: { type: String, required: true, unique: true },

    email: {type: String, unique: true},

    password: { type: String, required: true},

    master_password: {type: String, required: true},

    accounts: [{
        id : String,
        account_name : String,
        name : String,
        password : String,
        description: String
    }]

});


module.exports = mongoose.model('User', schemaUser);