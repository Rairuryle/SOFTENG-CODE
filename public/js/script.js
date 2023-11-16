document.addEventListener("DOMContentLoaded", function () {

    const errorResponse = document.getElementById("errorResponse");
    errorResponse.classList.remove("user-prompt", "slide-in");

    const successResponse = document.getElementById("successResponse");
    successResponse.classList.remove("user-prompt", "slide-in");
    
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            navLinks.forEach((link) => {
                link.classList.remove("active");
            });

            this.classList.add("active");
        });
    });

    function editModeDirect() {
        let url = window.location.toString();
        window.location = url.replace(/admin/, `edit`);
        console.log(window.location);
    }

    const editModeElements = document.querySelectorAll(".editMode");
    editModeElements.forEach(function (element) {
        element.addEventListener("click", editModeDirect);
    });

    function exitModeDirect() {
        let url = window.location.toString();
        window.location = url.replace(/edit/, `admin`);
        console.log(window.location);
    }

    const exitModeElements = document.querySelectorAll(".exitMode");
    exitModeElements.forEach(function (element) {
        element.addEventListener("click", exitModeDirect);
    });

    $('[id^="myButtonEventEdit"]').on("click", function () {
        var buttonId = $(this).attr("id");
        var popupId = $(this).attr("data-popup-id");
        var eventNameSpecific = $("#" + buttonId)
            .closest(".nav-link")
            .find(".eventNameSpecific")
            .text();
        var eventnameInput = $("#" + popupId).find(".eventname");
        eventnameInput.val(eventNameSpecific);
    });

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