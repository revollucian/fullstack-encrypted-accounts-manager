# Full-stack AES256 encrypted password and username combination storage desktop and web application


*Both front-end and back-end are built with JavaScript and NodeJS, the desktop application is an Electron 32bit app.*


#Screenshots 🎉

**Login screen**

![alt text](https://raw.githubusercontent.com/revollucian/fullstack-encrypted-accounts-manager/main/images/chrome_oO1POTLdXP.png)

**Signup screen**

![alt text](https://raw.githubusercontent.com/revollucian/fullstack-encrypted-accounts-manager/main/images/chrome_rh28AVqq9Z.png)

**Master password unlock screen (this decrypts info)**

![alt text](https://raw.githubusercontent.com/revollucian/fullstack-encrypted-accounts-manager/main/images/chrome_hfjNbqQEAw.png)

**Adding an account**

![alt text](https://raw.githubusercontent.com/revollucian/fullstack-encrypted-accounts-manager/main/images/chrome_I88oLnYA8z.png)

**Accounts screen and alert**

![alt text](https://raw.githubusercontent.com/revollucian/fullstack-encrypted-accounts-manager/main/images/chrome_NSef2p8agp.png)


**STARTING THE BACKEND**


Navigate to /backend and run in your terminal:

```npm start```



**STARTING THE FRONTEND**


Navigate to /Application and run execute ```Application.exe```

To build a new .exe navigate to /frontendV2 and simply do

```npm start``` - a new folder with an executable will be created!




## Security methods

- Username and password user authentification

- JSON Web Token action verification - used to secure sessions and auth users when they perform an action (e.g. add account credentials)

- AES encryption for storing account username/passwords

- Salting and hashing the password and master password of our Account Manager account - the salted and hashed strings are securely stored in a MongoDB database

- Few small API built-in features to prevent possible intruders

- Remote data acquisition and storage -> almost infinite potential for scalability and security implementations

## Technologies used

- MongoDB for storing accounts and user information
- NodeJS (for the backend and frontend) and Electron (making a desktop application)
- HTML, CSS, JavaScript as languages
- TailWind for CSS 
- AlpineJS and JQuery for manipulating frontend elements
- CryptoJS for the AES encryption



### NPM libraries used for the backend:

- bcryptjs - for salting, hashing and comparing strings (we used this for the login and verifying actions)
- body-parser - parsing JSON to the backend when a request happens
- cors - cors connection policy
- dotenv - EXTREMELY IMPORTANT - used to get the database credentials and encryption secret keys securely and efficiently
- express - essential web server framework
- jsonwebtoken - used to create and validate user tokens using a secret key we get from dotenv
- mongoose - interface for talking to MongoDB

### NPM libraries used for the frontend:

- electron
- electron-packager



**Why JavaScript?**

- Has MANY available encryption libraries that are proven and rugged

- Can be used for both the front-end and the back-end applications - we used it for both

- Could have been easily used by everyone in our group - the syntax is easy to understand and write (compared to say C++ - our first initial choice)

- We can create stylish, good looking and user friendly applications extremely fast with little to no fuss

- Its an industry standard language with a good track record of security updates (biggest companies in the world use it for their solutions)



Connection flow:

ELECTRON CLIENT <--API--> NODEJS BACKEND <--DATABASE--> MONGODB
