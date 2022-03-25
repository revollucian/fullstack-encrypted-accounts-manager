




        //success/error alerts we insert into the main page to show the user
        //this is mostly for styling and user experience

        function createAlert(type, message){

            // "ok" means that the operation was succesful
            if(type === "ok")
            return document.getElementById('main').innerHTML += `
            <div class="absolute bg-green-400 w-64 h-32 top-4 right-4 z-30 px-3 py-3 rounded-md flex flex-col"
                    x-data="{ open : true }"
                    x-show="open"
                    x-init="setTimeout(() => open = false, 3000)"
                    x-transition:enter="ease-out duration-300" 
                    x-transition:enter-start="opacity-0 scale-90" 
                    x-transition:enter-end="opacity-100 scale-100" 
                    x-transition:leave="ease-in duration-300" 
                    x-transition:leave-start="opacity-100 scale-100"
                    x-transition:leave-end="opacity-0 scale-90"
                    >

                    <div class="flex justify-between">
                        <span class="text-2xl text-white">Success</span>
                        <svg class="cursor-pointer text-white" width="18" height="18" xmlns="http://www.w3.org/2000/svg" @click="open = false" viewBox="0 0 24 24" fill="currentColor"fill-rule="evenodd" clip-rule="evenodd"><path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/></svg>
                    </div>

                    <span class="text-sm text-white mt-4">`+message+`</span>

                    </div>
            `

            // "no" means that the operation wasn't succesful
            if(type === "no"){
                return document.getElementById('main').innerHTML +=`
                    <div class="absolute bg-red-400 w-64 h-32 top-4 right-4 z-30 px-3 py-3 rounded-md flex flex-col"
                    x-data="{ open : true }"
                    x-show="open"
                    x-init="setTimeout(() => open = false, 3000)"
                    x-transition:enter="ease-out duration-300" 
                    x-transition:enter-start="opacity-0 scale-90" 
                    x-transition:enter-end="opacity-100 scale-100" 
                    x-transition:leave="ease-in duration-300" 
                    x-transition:leave-start="opacity-100 scale-100"
                    x-transition:leave-end="opacity-0 scale-90"
                    >

                    <div class="flex justify-between">
                        <span class="text-2xl text-white">Error</span>
                        <svg class="cursor-pointer text-white" width="18" height="18" xmlns="http://www.w3.org/2000/svg" @click="open = false" viewBox="0 0 24 24" fill="currentColor"fill-rule="evenodd" clip-rule="evenodd"><path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/></svg>
                    </div>

                    <span class="text-sm text-white mt-4">`+message+`</span>

                    </div>`
            }

        }






        // just setting the welcome message at the top to blank at the start so it doesn't show up before we add the logic

        document.getElementById("top_message").innerHTML = "";






        // function for adding the account elements to the HTML,
        // "encrypt" here is the mode, if we pass a string "encrypted" the data will show as stars

        function addAccountsToHTML(data, encrypt){
            document.getElementById("accounts").innerHTML = ""; // making sure our space is empty

            // the variables for the password/user we can use
            var show_password;
            var show_username;

            // make a loop so all this happens for every element in our data array

             for( i = 0 ; i < data.length ; i++){ 
                  
                 if(encrypt === "encrypted"){     //if encrypted mode is there we dont render the details, we render some stars - both for security reasons and cosmetic
                     show_password = "********"
                     show_username = "********"
                 }
                 
                 else{

                     // otherwise we just render the decrypted information, we decrypt by using the master password found in local storage.

                     show_password = encryption.decryptMessage(data[i].password, localStorage.getItem("mpass"))                                                                                        
                     show_username = encryption.decryptMessage(data[i]["name"], localStorage.getItem("mpass"))
                 }

                 //then for each element in our ACCOUNTS array we render a HTML object with our details
                 // += just adds elements one after the other

                document.getElementById("accounts").innerHTML +=  `            
                    <div class="w-full h-64 bg-white mt-3 rounded-md shadow-sm flex flex-col px-3 py-3">

                        <div class="flex justify-between items">

                            <span class="text-2xl font-light">`+data[i].account_name+`</span>

                            <div class="flex gap-3">


                    <div id="`+data[i].id+`" data-name="`+data[i].account_name+`" class="flex items-center justify-center bg-gray-100 w-8 h-8 rounded-full cursor-pointer" onclick="setDelete(this.id, this.dataset.name)" @click="del=true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></svg>
                    </div>

                    <div id="`+data[i].id+`" data-name="`+data[i].account_name+`" class="flex items-center justify-center bg-gray-100 w-8 h-8 rounded-full cursor-pointer" onclick="setModify(this.id, this.dataset.name)" @click="modify=true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/></svg>
                    </div>

                            </div>

                        </div>
                     
                        <div class="flex flex-col mt-5">
                            <span class="text-xs text-gray-400">Description</span>
                            <span class="text-sm mt-2">`+data[i].description+`</span>
                        </div>

                        <div class="w-1/2 grid grid-cols-2 mt-10 gap-3">
                            <span class="text-xs text-gray-400 truncate">Username</span>
                            <span class="encrypted text-sm">`+show_username+`</span>
                        </div>

                        <div class="w-1/2 grid grid-cols-2 mt-5 gap-3">
                            <span class="text-xs text-gray-400 truncate">Password</span>
                            <span class="encrypted text-sm">`+show_password+`</span>
                        </div>

                    </div>`
             }
        }
