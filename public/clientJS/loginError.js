document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const registerForm = document.querySelector("#register-form");
    const errorMessage = document.querySelector("#error-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const response = await fetch("/user/WFMlogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorMessage.textContent = data.message;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const response = await fetch("/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorMessage.textContent = data.message;
            }
        });
    }
});