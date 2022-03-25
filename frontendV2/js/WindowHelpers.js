



        //setting the id of the modify popup so we can use it

        function setModify(id, name){
            $('.modifyPopup').attr("id", id);
            $('.modifyPopupname').html("Modifying your " + name + " account");
        }


        function setDelete(id, name){
            $('.deletePopup').attr("id", id);
            $('.deletePopupname').html("Are you use you want to delete " + name + "?");
        }



        // functions for showing the dashboard or login screen

        function showDashboard(){
            document.getElementById("dashboard").classList.remove("hidden")
            document.getElementById("dashboard").classList.add("visible", "flex")
        }

        function showLogin(){
            document.getElementById("login").classList.remove("hidden")
            document.getElementById("login").classList.add("visible", "flex")
        }



        // logging out by deleting the token from the local storage and reloading.
        // this will result in the onload function not being able to find the token and just showing the login screen again
        function logOut(){
            location.reload()
            localStorage.removeItem('token')
        }