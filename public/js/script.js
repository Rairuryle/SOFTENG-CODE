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


// popup button @ university-events-edit & college-events-edit
// Get references to the buttons and the popup
const myButtonEvent = document.getElementById("myButtonEvent");
const myButtonEventEdit = document.getElementById("myButtonEventEdit");
const myButtonEventDelete = document.getElementById("myButtonEventDelete");
const myButtonActivity = document.getElementById("myButtonActivity");
const myButtonActivityEdit = document.getElementById("myButtonActivityEdit");
const myButtonActivityDelete = document.getElementById("myButtonActivityDelete");

const myPopupEvent = document.getElementById("myPopupEvent");
const myPopupEventEdit = document.getElementById("myPopupEventEdit");
const myPopupEventDelete = document.getElementById("myPopupEventDelete");
const myPopupActivity = document.getElementById("myPopupActivity");
const myPopupActivityEdit = document.getElementById("myPopupActivityEdit");
const myPopupActivityDelete = document.getElementById("myPopupActivityDelete");


function showPopup(popup) {
    // Hide all popups
    myPopupEvent.style.display = "none";
    myPopupEventEdit.style.display = "none";
    myPopupEventDelete.style.display = "none";
    myPopupActivity.style.display = "none";
    myPopupActivityEdit.style.display = "none";
    myPopupActivityDelete.style.display = "none";

    // Display the selected popup
    popup.style.display = "block";
}

function closePopup() {
    myPopupEvent.style.display = "none";
    myPopupEventEdit.style.display = "none";
    myPopupEventDelete.style.display = "none";
    myPopupActivity.style.display = "none";
    myPopupActivityEdit.style.display = "none";
    myPopupActivityDelete.style.display = "none";
}


myButtonEvent.addEventListener("click", function () {
    showPopup(myPopupEvent);
});

myButtonEventEdit.addEventListener("click", function () {
    showPopup(myPopupEventEdit);
});

myButtonEventDelete.addEventListener("click", function () {
    showPopup(myPopupEventDelete);
});

myButtonActivity.addEventListener("click", function () {
    showPopup(myPopupActivity);
});

myButtonActivityEdit.addEventListener("click", function () {
    showPopup(myPopupActivityEdit);
});

myButtonActivityDelete.addEventListener("click", function () {
    showPopup(myPopupActivityDelete);
});

// Close the popups when clicking outside or on "SAVE" button


myPopupEvent.addEventListener("click", function (event) {
    if (event.target === myPopupEvent) {
        closePopup();
    }
});

myPopupEventEdit.addEventListener("click", function (event) {
    if (event.target === myPopupEventEdit) {
        closePopup();
    }
});

myPopupEventDelete.addEventListener("click", function (event) {
    if (event.target === myPopupEventDelete) {
        closePopup();
    }
});

myPopupActivity.addEventListener("click", function (event) {
    if (event.target === myPopupActivity) {
        closePopup();
    }
});

myPopupActivityEdit.addEventListener("click", function (event) {
    if (event.target === myPopupActivityEdit) {
        closePopup();
    }
});

myPopupActivityDelete.addEventListener("click", function (event) {
    if (event.target === myPopupActivityDelete) {
        closePopup();
    }
});

const saveButtonEvent = myPopupEvent.querySelector("#closePopup");
const saveButtonEventEdit = myPopupEventEdit.querySelector("#closePopup");
const saveButtonEventDelete = myPopupEventDelete.querySelector("#closeDeletePopup");
const saveButtonActivity = myPopupActivity.querySelector("#closePopup");
const saveButtonActivityEdit = myPopupActivityEdit.querySelector("#closePopup");
const saveButtonActivityDelete = myPopupActivityDelete.querySelector("#closeDeletePopup");

saveButtonEvent.addEventListener("click", closePopup);
saveButtonEventEdit.addEventListener("click", closePopup);
saveButtonEventDelete.addEventListener("click", closePopup);
saveButtonActivity.addEventListener("click", closePopup);
saveButtonActivityEdit.addEventListener("click", closePopup);
saveButtonActivityDelete.addEventListener("click", closePopup);


myButtonActivityEdit.addEventListener("click", function () {
    // Get the text from #activityNameSpecific
    const activityNameSpecific = document.querySelector(".activityNameSpecific").textContent;

    // Update all elements with class .activityname
    const activityNameElements = document.querySelectorAll(".activityname");
    activityNameElements.forEach(function (element) {
        if (element.tagName === 'INPUT') {
            element.value = activityNameSpecific;
        }
    });
});

myButtonEventEdit.addEventListener("click", function () {
    // Get the text from #activityNameSpecific
    const eventNameSpecific = document.querySelector(".eventNameSpecific").textContent;

    // Update all elements with class .activityname
    const eventNameElements = document.querySelectorAll(".eventname");
    eventNameElements.forEach(function (element) {
        if (element.tagName === 'INPUT') {
            element.value = eventNameSpecific;
        }
    });
});




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

const errorMessage = document.getElementById('errorMessage').textContent;

// Display the message
const errorMessageElement = document.getElementById('errorMessage');

// Hide the message after 3000 milliseconds (3 seconds)
setTimeout(function () {
    errorMessageElement.classList.add("hidden");
}, 3000);

$(function () {
    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
});



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
