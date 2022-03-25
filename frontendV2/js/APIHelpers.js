

            //these are critical functions and variables for talking to the backend API



                        //ENDPOINTS


                        //API endpoints for getting data

                        const URL_LOGIN = 'http://localhost:3000/api/user/login'
                        const URL_REGISTER = 'http://localhost:3000/api/user/register'
                        const URL_ACCOUNTS = 'http://localhost:3000/api/user/getaccounts'
                        const URL_ADD_ACCOUNTS = 'http://localhost:3000/api/user/createaccount'
                        const URL_MODIFY= 'http://localhost:3000/api/user/modifyaccount'
                        const URL_DELETE= 'http://localhost:3000/api/user/deleteaccount'
                        const URL_post= 'http://localhost:3000/api/user/mastervalidate'
                        const URL_MASTERCHANGE = 'http://localhost:3000/api/user/masterchange'
                        const URL_PASSWORDCHANGE = 'http://localhost:3000/api/user/changepassword'


                        //Accounts array
                        //We use this to temporarily store accounts data so we can list it to the user

                        var ACCOUNTS = [];
                        




            //POST function for getting and supplying server-side data
            // we are going to use this a lot communicating with our backend,
            // almost all of our endpoints are just POST 

            async function post(url = '', data = {}) {
                const response = await fetch(url, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) // body data type must match "Content-Type" header
                });
                return response.json(); // parses JSON response into native JavaScript objects
            }







        
            // checking if we have a token when our document if first loaded

            document.addEventListener("DOMContentLoaded", () =>{

                localStorage.removeItem('mpass') // we are storing the master password in the local storage, we remove it when the page loads for security reasons
                
    
                // if there is a token in the local storage this will be true and move on
                // this is what allows us to store a session even if the application is closed.
                if(localStorage.getItem("token")){
    
                // this is due to the fact that Electron (the framework we are using for packing a desktop application) is built with Chromium!
                // we are basically using a browser without the fancy controls that Chrome has - and it looks exactly like a traditional desktop app
                // for context, Visual Studio Code is also built on top of Electron!
    
    
                    // we then try to verify the token with a POST to our backend
                    post(URL_ACCOUNTS, {"token" : localStorage.getItem("token")}) 
                    .then(data => {
    
                        //if it cant verify we show the login page
                        if(data.status === "error" && data.status === "Invalid"){
                            showLogin()
                            return 
                        }
    
                        //else we get accounts from the data, display them and show the dashboard
    
                        const formatted = [JSON.parse(data.current_accounts)]
                        document.getElementById("top_message").innerHTML = "Welcome back, " + formatted[0].username;
    
                        for(let i = 0; i < formatted[0].accounts.length; i++ ){
                            ACCOUNTS.push(formatted[0].accounts[i]);    
                        }
    
                        addAccountsToHTML(ACCOUNTS, "encrypted")         
                        showDashboard()
                    });
                }
    
                // just in case
                else{
                    document.getElementById("top_message").innerHTML =`You're not logged in, <span class="font-bold">log in</span>`    
                    showLogin()
    
                }
            });




            
            

        //sending a POST request to our backend for the login, we pass the username and password and we expect a token field
        function login(){
            post(URL_LOGIN, {"username" : document.getElementById("username_field").value, "password" : document.getElementById("password_field").value})
            .then(data => {
                 if(data.status === "ok" && data.token){
    
                        // if the status is okay and we get a token we pass it into local storage to be used for later
                        // this allows us to check if the user is logged in even after closing the window
    
                     localStorage.setItem('token', data.token);
    
                     //then we reload so we made the onload function check for the token and log the user in
                                       
                     createAlert("ok", "Logging in")
                     return location.reload();
                 }
                 createAlert("no", "Incorrect credentials")
             });
            }
    
    
    


    
    
            //sending a POST request to our backend for the register, we pass the username and password and we expect a token field
    
            function signup(){
                console.log(document.getElementById("account_username_register").value)
                post(URL_REGISTER, {
    
                    //passing the account information
    
                "username" : document.getElementById("account_username_register").value, 
                "email" : document.getElementById("account_email_register").value, 
                "password" : document.getElementById("account_password_register").value,
                "m_password": document.getElementById("account_password_master").value
                })
            .then(data => {
    
                //we can receive a few different responses here
                //trying to account for each one below
    
                if(data.status === "ok" && data.message ==="User created"){
                    createAlert("ok", data.message + ", please log in.")
                }
                if(data.status === "error" && data.message ==="Incorrect username format"){
                    createAlert("no", data.message)
                }
                if(data.status === "error" && data.message ==="Password too short"){
                    createAlert("no", data.message)
                }
    
                console.log(data)
       
             });
            }
    
    

            



        // we are using this function to refresh our accounts array
    
        function refreshAccounts(){
            ACCOUNTS = [];
            post(URL_ACCOUNTS, {"token" : localStorage.getItem("token")}) 
                .then(data => {
                    const formatted = [JSON.parse(data.current_accounts)]

                    //we replace that blank message with a welcome message and our name
                    //user experience !

                    document.getElementById("top_message").innerHTML = "Welcome back, " + formatted[0].username;

                    for(let i = 0; i < formatted[0].accounts.length; i++ ){
                        ACCOUNTS.push(formatted[0].accounts[i]);  
                    }
                    addAccountsToHTML(ACCOUNTS)         
                });
        }



        


        //changing the master password involved a few things (hence why its the longest function), we had to make sure that when we change it we decrypt all account info
        //using the old master password and then re-encrypting it with the new one, otherwise it fails

        //the account information is again encrypted using AES and our master password as the key, the page then refreshes.

        function changeMasterPassword(){

            // we check if our token is correct

            post(URL_post, {"token" : localStorage.getItem("token"), "m_password" : document.getElementById("master_old").value})
            .then(data => {
            
            // if its not then we show a nice error message and return

            if(data.status==="error" && data.message){
                return createAlert("no", "Invalid password combination")  
            }

            // else we just proceed
            if(data.status === "ok" && data.message === "Correct"){ // we expect the server to tell us the master password belongs to the user

                // we send a POST request to the server with our token, old password and the new one

                 post(URL_MASTERCHANGE, {"token" : localStorage.getItem("token"), "old_password" : document.getElementById("master_old").value, "m_password" : document.getElementById("master_new").value}) 
                    .then(data => {

                        // we store the new password in local storage
                        localStorage.setItem('mpass', document.getElementById("master_new").value);
                        if(ACCOUNTS.length === 0){
                            createAlert("ok", "Master password changed, refreshing")
                            return location.reload() // if there are no accounts to edit just reload
                        }
                
                        for(i = 0 ; i < ACCOUNTS.length; i++){

                        // we modify each account in our list

                        post(URL_MODIFY, {"token" : localStorage.getItem("token"), account_id : ACCOUNTS[i].id , modified_account : {
                                "account_name" : ACCOUNTS[i].account_name,

                                //notice how we are decrypting using the old password and encrypting with the new one

                                "name" : encryption.encryptMessage(encryption.decryptMessage(ACCOUNTS[i].name, document.getElementById("master_old").value), document.getElementById("master_new").value),
                                "password" :  encryption.encryptMessage(encryption.decryptMessage(ACCOUNTS[i].password, document.getElementById("master_old").value), document.getElementById("master_new").value),
                                "description" : ACCOUNTS[i].description
                        }}) 

                        // after thats all done we refresh

                        .then(data => {
                            createAlert("ok", "Master password changed, refreshing")
                            location.reload()
                        });

                        }  

                    });
                 return console.log("ok")
             }
             console.log("no")
         });
        }






             //pretty simple operations of posting data to the endpoint and expecting a response

             function addAccount(){
                post(URL_ADD_ACCOUNTS, {"token" : localStorage.getItem("token"), account : {
    
                    //we pass the information for the new account entry
    
                    "account_name" :document.getElementById("account_name").value,
                    "name" : encryption.encryptMessage(document.getElementById("account_username").value, localStorage.getItem("mpass")),
                    "password" : encryption.encryptMessage(document.getElementById("account_password").value, localStorage.getItem("mpass")),
                    "description" : document.getElementById("account_description").value
    
                }}) 
                    .then(data => {
    
                        //if we get an ok status we give an alert and let the user know, then refresh
    
                        if(data.status === "ok" && data.message === 'Succesfully added'){
                            createAlert("ok", "Succesfully created " + document.getElementById("account_name").value)
                            return refreshAccounts() 
                        }
    
                        // if we cant add an account we show an error message
    
                        createAlert("no", "Couldn't add account")
    
                    });
            }
    





        //modifying an account 

        function modifyAccount(id){
            post(URL_MODIFY, {"token" : localStorage.getItem("token"), account_id : id ,modified_account : {

                //putting in the information we need in the POST request so we can modify an account

                "account_name" :document.getElementById("account_name_modify").value,
                "name" : encryption.encryptMessage(document.getElementById("account_username_modify").value, localStorage.getItem("mpass")),
                "password" : encryption.encryptMessage(document.getElementById("account_password_modify").value, localStorage.getItem("mpass")),
                "description" : document.getElementById("account_description_modify").value

            }}) 
                .then(data => {
                                        //if we get an ok status we give an alert and let the user know, then refresh

                    if(data.status === "ok" && data.message === 'Modified succesfully'){

                        //showing the user alerts

                        createAlert("ok", "Succesfully modified " + document.getElementById("account_name_modify").value)
                        return refreshAccounts() 
                    }
                    createAlert("no", "Couldn't modify account")          
                });
            }






            
        // if you couldn't tell the front-end is just doing a bunch of requests :) this is a delete account request

        function deleteAccount(id){

            //checking for the validity of the token and deleting the account by passing its "account_id"
            //reminder : each account created has a unique ID we can use for these operations

            post(URL_DELETE, {"token" : localStorage.getItem("token"), account_id : id }) 
                .then(data => {
                    
                    //if its all okay we 
                    if(data.status === "ok" && data.message === 'Deleted succesfully'){
                        createAlert("ok", "Succesfully deleted" + document.getElementById("account_name_modify").value)
                        return refreshAccounts() 
                    }

                    createAlert("no", "Couldn't delete account")      
                });

        }





        
        
        //verifying our token, sending a new password, removing the old token and then refreshing if succesful, 
        //this makes the user log in again after changing passwords so we have a fresh token to work with
        //quite industry standard

        function changePassword(){
            post(URL_PASSWORDCHANGE, {"token" : localStorage.getItem("token"), "npassword" : document.getElementById("new_password").value}) 
                .then(data => {

                    if(data.status === "ok" && data.message === 'Succesfully updated'){
                        createAlert("ok", data.message+", refreshing.")
                        localStorage.removeItem('token')
                        return location.reload()
                    }
                    createAlert("no", "Couldn't update password")
          
                });
        }





        

        //we validate our token before going ahead and deleting the "blocker" overlay and refreshing the accounts with our "encrypted" flag

        function validateAndShow(){
            post(URL_post, {"token" : localStorage.getItem("token"), "m_password" : document.getElementById("masterpassword_field").value})
            .then(data => {
                // we expect the server to tell us the master password belongs to the user
    
                 if(data.status === "ok" && data.message === "Correct"){ 
    
                    // if it goes through we replace the master password in local storage with the new one
                     localStorage.setItem('mpass', document.getElementById("masterpassword_field").value);
                     document.getElementById("blocker").classList.add("hidden")
    
                     //showing a nice alert
                     createAlert("ok", "Decrypted succesfully")
                     return refreshAccounts()
                 }
                 //else we return an error
                 return createAlert("no", "Wrong master password")
             });
            }
    