document.addEventListener("DOMContentLoaded", function () {
    const errorResponse = document.getElementById("errorResponse");
    errorResponse.classList.remove("user-prompt", "slide-in");

    const successResponse = document.getElementById("successResponse");
    successResponse.classList.remove("user-prompt", "slide-in");
});


// show/hide password @ login.html
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("togglePassword");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.classList.remove("far", "fa-eye");
        toggleButton.classList.add("fas", "fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleButton.classList.remove("fas", "fa-eye-slash");
        toggleButton.classList.add("far", "fa-eye");
    }
}

document.getElementById("gridsearchIDNumber").maxLength = "9";