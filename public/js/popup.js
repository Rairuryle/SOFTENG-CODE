// Get all elements with the 'addMore' class
const addMoreButtons = document.querySelectorAll('.addMore');

// Loop through all 'addMore' buttons and add a click event listener to each
addMoreButtons.forEach(function (addMoreButton) {
    addMoreButton.addEventListener('click', function () {
        // Find the corresponding '.inputs' container for this button
        let inputs = document.querySelector('.inputs');

        let newInputName = document.createElement('input');
        newInputName.type = 'text';
        newInputName.placeholder = 'Activity Name';
        newInputName.name = 'activityname[]';
        newInputName.classList.add('input-style');

        let newInputDate = document.createElement('input');
        newInputDate.type = 'date';
        newInputDate.name = 'activitydate[]';
        newInputDate.classList.add('input-style');

        inputs.appendChild(newInputName);
        inputs.appendChild(newInputDate);
    });
});


const closeButtons = document.querySelectorAll('.closePopup');

closeButtons.forEach(button => {
    button.addEventListener('click', function () {
        const popupId = this.getAttribute('data-popup-id');
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'none';
        }
    });
});

// const myButtonEvents = document.querySelectorAll('.myButtonEvent');

// myButtonEvents.forEach(button => {
//     button.addEventListener('click', function () {
//         const popupId = this.getAttribute('data-popup-id');
//         const popup = document.getElementById(popupId);
//         if (popup) {
//             popup.style.display = 'block';
//         }
//     });
// });


function showPopup(popup) {
    // Hide all popups
    myPopupEvent.style.display = "none";
    myPopupEventEdit.style.display = "none";
    myPopupEventDelete.style.display = "none";
    // myPopupActivity.style.display = "none";
    // myPopupActivityEdit.style.display = "none";
    // myPopupActivityDelete.style.display = "none";

    // Display the selected popup
    popup.style.display = "block";
}

function showEventName() {
    const eventNameSpecific = document.querySelector(".eventNameSpecific").textContent;
    const eventNameElements = document.querySelectorAll(".eventname");
    eventNameElements.forEach(function (element) {
        if (element.tagName === 'INPUT') {
            element.value = eventNameSpecific;
        }
    });
};

// function closePopup() {
//     myPopupEvent.style.display = "none";
//     myPopupEventEdit.style.display = "none";
//     myPopupEventDelete.style.display = "none";
//     // myPopupActivity.style.display = "none";
//     // myPopupActivityEdit.style.display = "none";
//     // myPopupActivityDelete.style.display = "none";
// }

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

myButtonEvent.addEventListener("click", function () {
    showPopup(myPopupEvent);
});

myButtonEventEdit.addEventListener("click", function () {
    showPopup(myPopupEventEdit);
    showEventName();
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


// myPopupEvent.addEventListener("click", function (event) {
//     if (event.target === myPopupEvent) {
//         closePopup();
//     }
// });

// myPopupEventEdit.addEventListener("click", function (event) {
//     if (event.target === myPopupEventEdit) {
//         closePopup();
//     }
// });

// myPopupEventDelete.addEventListener("click", function (event) {
//     if (event.target === myPopupEventDelete) {
//         closePopup();
//     }
// });

// myPopupActivity.addEventListener("click", function (event) {
//     if (event.target === myPopupActivity) {
//         closePopup();
//     }
// });

// myPopupActivityEdit.addEventListener("click", function (event) {
//     if (event.target === myPopupActivityEdit) {
//         closePopup();
//     }
// });

// myPopupActivityDelete.addEventListener("click", function (event) {
//     if (event.target === myPopupActivityDelete) {
//         closePopup();
//     }
// });

// const saveButtonEvent = myPopupEvent.querySelector("#closePopup");
// const saveButtonEventEdit = myPopupEventEdit.querySelector("#closePopup");
// const saveButtonEventDelete = myPopupEventDelete.querySelector("#closeDeletePopup");
// const saveButtonActivity = myPopupActivity.querySelector("#closePopup");
// const saveButtonActivityEdit = myPopupActivityEdit.querySelector("#closePopup");
// const saveButtonActivityDelete = myPopupActivityDelete.querySelector("#closeDeletePopup");

// saveButtonEvent.addEventListener("click", closePopup);
// saveButtonEventEdit.addEventListener("click", closePopup);
// saveButtonEventDelete.addEventListener("click", closePopup);
// saveButtonActivity.addEventListener("click", closePopup);
// saveButtonActivityEdit.addEventListener("click", closePopup);
// saveButtonActivityDelete.addEventListener("click", closePopup);



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