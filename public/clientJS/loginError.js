function validateForm(event) {

    fetch('/user/userExists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', //Tell the server we're sending JSON data    
        },
        body: JSON.stringify({ username: username }),
        //Send username to check if user exists  
    })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                //User exists, show an error message      
                document.getElementById('error-message').innerHTML = 'This username is already taken. Please choose another one.';
                return false;
            } else {
                //User doesn't exist, proceed to submit the form data via another fetch request      
                return true;
            }
        })

}