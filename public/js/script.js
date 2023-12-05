document.addEventListener("DOMContentLoaded", function () {

    function setActiveLink() {
        const activeLinkIndex = localStorage.getItem("activeLinkIndex");
        if (activeLinkIndex !== null) {
            const activeLink = document.getElementById(`navLink${activeLinkIndex}`);
            if (activeLink !== null) {
                activeLink.classList.add("active");
            }
        }
    }

    setActiveLink();

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link, index) => {
        link.setAttribute("id", `navLink${index}`);

        link.addEventListener("click", function (event) {
            event.preventDefault();

            navLinks.forEach((link) => {
                link.classList.remove("active");
            });

            this.classList.add("active");
            this.setAttribute('data-nav-id', index);

            localStorage.setItem("activeLinkIndex", index);
        });
    });

    const errorResponse = document.getElementById("errorResponse");
    errorResponse.classList.remove("user-prompt", "slide-in");

    const successResponse = document.getElementById("successResponse");
    successResponse.classList.remove("user-prompt", "slide-in");

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
});

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