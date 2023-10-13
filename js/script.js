document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
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
});


var selects = document.querySelectorAll("#student-role-dropdown");

// Add an event listener to each select element
selects.forEach(function(select) {
    select.addEventListener("change", function() {
        // Get the selected option
        var selectedOption = select.options[select.selectedIndex];

        // Set the color of the selected text to match the option text color
        select.style.color = getComputedStyle(selectedOption).color;
    });
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


// popup button @ college-events-edit.html
// Get references to the buttons and the popup
const myButtonEvent = document.getElementById("myButtonEvent");
const myButtonActivity = document.getElementById("myButtonActivity");
const myPopupEvent = document.getElementById("myPopupEvent");
const myPopupActivity = document.getElementById("myPopupActivity");

function showPopup(popup) {
    // Hide all popups
    myPopupEvent.style.display = "none";
    myPopupActivity.style.display = "none";

    // Display the selected popup
    popup.style.display = "block";
}

function closePopup() {
    myPopupEvent.style.display = "none";
    myPopupActivity.style.display = "none";
}

myButtonEvent.addEventListener("click", function () {
    showPopup(myPopupEvent);
});

myButtonActivity.addEventListener("click", function () {
    showPopup(myPopupActivity);
});

// Close the popups when clicking outside or on "SAVE" button
myPopupEvent.addEventListener("click", function (event) {
    if (event.target === myPopupEvent) {
        closePopup();
    }
});

myPopupActivity.addEventListener("click", function (event) {
    if (event.target === myPopupActivity) {
        closePopup();
    }
});

const saveButtonEvent = myPopupEvent.querySelector("#closePopup");
const saveButtonActivity = myPopupActivity.querySelector("#closePopup");

saveButtonEvent.addEventListener("click", closePopup);
saveButtonActivity.addEventListener("click", closePopup);



// add new activity @ college-events-edit.html, add-activities-events-holder
let addMore = document.getElementById('addMore');
let inputs = document.querySelector('.inputs');

addMore.addEventListener('click', function () {
    let newInputName = document.createElement('input');
    newInputName.type = 'text';
    newInputName.placeholder = 'Activity Name';
    newInputName.name = 'activityname[]';
    newInputName.classList.add('input-style'); // Add a CSS class to the new input

    let newInputDate = document.createElement('input');
    newInputDate.type = 'date';
    newInputDate.name = 'activitydate[]';
    newInputDate.classList.add('input-style'); // Add the same CSS class to the new input

    inputs.appendChild(newInputName);
    inputs.appendChild(newInputDate);
});

let addMoreActivity = document.getElementById('addMoreActivity');
let inputsActivity = document.querySelector('.inputsActivity');

addMoreActivity.addEventListener('click', function () {
    let newInputNameActivity = document.createElement('input');
    newInputNameActivity.type = 'text';
    newInputNameActivity.placeholder = 'Activity Name';
    newInputNameActivity.name = 'activityname[]';
    newInputNameActivity.classList.add('input-style'); // Add a CSS class to the new input

    let newInputDateActivity = document.createElement('input');
    newInputDateActivity.type = 'date';
    newInputDateActivity.name = 'activitydate[]';
    newInputDateActivity.classList.add('input-style'); // Add the same CSS class to the new input

    inputsActivity.appendChild(newInputNameActivity);
    inputsActivity.appendChild(newInputDateActivity);
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