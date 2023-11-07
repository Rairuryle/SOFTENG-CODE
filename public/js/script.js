document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            // Prevent the default behavior of the link
            event.preventDefault();

            // Remove the 'active' class from all links
            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            // Add the 'active' class to the clicked link
            this.classList.add("active");
        });
    });

    // const navLinks = document.querySelectorAll(".nav-link");
    // const myButton = document.getElementById("myButton");

    // navLinks.forEach(link => {
    //     link.addEventListener("click", function (event) {
    //         // Prevent the default behavior of the link
    //         event.preventDefault();

    //         // Remove the 'active' class from all links
    //         navLinks.forEach(link => {
    //             link.classList.remove("active");
    //         });

    //         // Add the 'active' class to the clicked link
    //         this.classList.add("active");

    //         // Update button's background color
    //         if (this.classList.contains("active")) {
    //             myButton.style.backgroundColor = "blue";
    //         } else {
    //             myButton.style.backgroundColor = ""; // Reset the background color
    //         }
    //     });
    // });

    // const navLinks = document.querySelectorAll(".nav-link");
    // const myButton = document.getElementById("myButton");

    // function removeButtonColor() {
    //     myButton.style.backgroundColor = "";
    // }

    // navLinks.forEach(link => {
    //     link.addEventListener("click", function (event) {
    //         // Prevent the default behavior of the link
    //         event.preventDefault();

    //         // Remove the 'active' class from all links
    //         navLinks.forEach(link => {
    //             link.classList.remove("active");
    //         });

    //         // Add the 'active' class to the clicked link
    //         this.classList.add("active");

    //         // Update button's background color
    //         myButton.style.backgroundColor = "blue";
    //     });
    // });

    // document.addEventListener("click", function (event) {
    //     const isNavLink = Array.from(navLinks).some(link => link.contains(event.target));
    //     if (!isNavLink) {
    //         // Clicked outside of the navigation links, so remove the button's background color
    //         removeButtonColor();
    //     }
    // });
    
    // const navLinks = document.querySelectorAll(".nav-link");
    // const buttons = document.querySelectorAll(".buttones");

    // navLinks.forEach(link => {
    //     link.addEventListener("click", function (event) {
    //         event.preventDefault();

    //         const buttonTarget = this.getAttribute("data-button-target");

    //         // Remove the 'active' class from all links
    //         navLinks.forEach(link => {
    //             link.classList.remove("active");
    //         });

    //         // Add the 'active' class to the clicked link
    //         this.classList.add("active");

    //         // Update button's background color based on the data attribute
    //         buttons.forEach(button => {
    //             const buttonColor = button.getAttribute("data-button-color");
    //             if (buttonTarget === buttonColor) {
    //                 button.style.backgroundColor = buttonColor;
    //             } else {
    //                 button.style.backgroundColor = "";
    //             }
    //         });
    //     });
    // });

    var selects = document.querySelectorAll(".student-role-dropdown");

    // Add an event listener to each select element
    selects.forEach(function (select) {
        select.addEventListener("change", function () {
            // Get the selected option
            var selectedOption = select.options[select.selectedIndex];

            // Set the color of the selected text to match the option text color
            select.style.color = getComputedStyle(selectedOption).color;
        });
    });

    const errorResponse = document.getElementById("errorResponse");
    errorResponse.classList.remove("user-prompt", "slide-in");

    const successResponse = document.getElementById("successResponse");
    successResponse.classList.remove("user-prompt", "slide-in");
});

// Get the "See More / See Less" button element
const seeMoreButton = document.querySelector(".see-more");

// Get all the hidden rows
const hiddenRows = document.querySelectorAll(".hidden-row");

// Add a click event listener to the button
seeMoreButton.addEventListener("click", function () {
    // Toggle the visibility of the hidden rows and update their data-visible attribute
    hiddenRows.forEach((row) => {
        const isVisible = row.getAttribute("data-visible") === "true";
        row.style.display = isVisible ? "none" : "table-row";
        row.setAttribute("data-visible", !isVisible);
    });

    // Change the text of the button
    if (seeMoreButton.textContent === "See More") {
        seeMoreButton.textContent = "See Less";
    } else {
        seeMoreButton.textContent = "See More";
    }
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

// const errorMessage = document.getElementById('errorMessage').textContent;

// // Display the message
// const errorMessageElement = document.getElementById('errorMessage');

// // Hide the message after 3000 milliseconds (3 seconds)
// setTimeout(function () {
//     errorMessageElement.classList.add("hidden");
// }, 3000);


// const logoutPrompt = document.getElementById('logoutPrompt').textContent;

// // Display the message
// const logoutPromptElement = document.getElementById('logoutPrompt');

// // Hide the message after 3000 milliseconds (3 seconds)
// setTimeout(function () {
//     logoutPrompt.classList.add("hidden");
// }, 3000);

// document.AddEventListener('DOMContentLoaded', function () {
//     loadHTMLTable([]);
// });

// function loadHTMLTable(data) {
//     const table = document.querySelector('table tbody');
//     let tableHTML = "";
//     if (data.length === 0) {
//         table.innerHTML = "<tr><td class='no-data' colspan='5'>No data</td></tr>";
//     }
// }

//for navbarUniversity to go to university-events-edit

// function editModeDirect() {
//     let url = window.location.toString();
//     window.location = url.replace(/admin/, `edit`);
//     console.log(window.location);
// }

// const editModeElements = document.querySelectorAll('.editMode');
// editModeElements.forEach(function (element) {
//     element.addEventListener('click', editModeDirect);
// });