//.env variables
require('dotenv').config();

//express server
const express = require('express');
var cors = require('cors');

//parser
const bodyParser = require('body-parser')


//mongoose for talking to mongodb
const mongoose= require('mongoose');
    mongoose.connect(process.env.mongodb,  () => {
        console.log('Connected to DB')
    })




// Hey viewer, most of the API source code is in routes/auth.js (for user authentification) and routes/accounts.js (for managing the accounts of each user),
// visit that to see it !


// The source for the frontend is located inside frontendV2/index.html !! - To start the application run "Application.exe" found inside Application/ - this is the compiled application!


// ----------------IMPORTANT please read further for some important information----------------


// A lot of security features here are self explanatory however we are using

// - Username/password authentication followed by
// - JSON Web Token authentication for verifying user actions - this allows us to not have a shared secret between client and server or save username and password in the user session
// - AES encryption on the client side, every time the user submits an account to store it is encrypted with their master password
// --- the server never knows their plaintext information of the user besides non-identifying information (user, email), only the client is aware of the true password
// - Salting and hashing of the password and master_password when introduced in the database, this means that even in the case of a breach no valuable information is leaked
// - The database itself requires credentials to be accessed, only our server has this information in a .env file
// - We are using a MongoDB Atlas instance in the cloud to run our database, meaning that it should be online and running at the time you are reading this with no interruptions

// We aren't storing any file locally - we wanted to go a step further and make it cloud based, this means that neither the 
// client or the server have direct access to the data if we reset the database credentials - which we consider a significant security feature.

// Cloud technology also means that the user can access their information from anywhere! Which might be useful.

// Any other technologies, frameworks used and instructions on how to start the backend/frontend can be found in the README.MD file in the main directory, please read that!!

// If interested the user schema is located inside models/User.js



//make "app" variable our express sever
const app = express();
app.use(bodyParser.json());

//CORS policy !
app.use(cors());
app.options('*', cors());

//routes
const auth = require('./routes/auth');
const accounts = require('./routes/accounts');


//middleware
app.use('/api/user', auth);
app.use('/api/user', accounts);

//getting our port from the .env file, its just 3000 for now.

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Running on port ${port}`);
})