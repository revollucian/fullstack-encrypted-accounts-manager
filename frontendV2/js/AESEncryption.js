



        //AES encryption for our account information
        //this part is EXTREMELY important
        //we are using the AES library + our master password to encrypt the username/passwords of our accounts stored
        //below this there are a lot of functions for geting data and submitting data
       
        let encryption = (function(){
            return{
            encryptMessage: function(messageToencrypt = '', secretkey = ''){
                var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
                return encryptedMessage.toString();
            },
            decryptMessage: function(encryptedMessage = '', secretkey = ''){
                var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
                var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

                return decryptedMessage;
            }
            }
        })();
