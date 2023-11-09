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

// Get all elements with the 'addMore' class
const addMoreActivitiesButtons = document.querySelectorAll('.addMoreActivities');

// Loop through all 'addMore' buttons and add a click event listener to each
addMoreActivitiesButtons.forEach(function (addMoreActivitiesButton) {
    addMoreActivitiesButton.addEventListener('click', function () {
        console.log('ok');
        // Find the corresponding '.inputs' container for this button
        let inputs = document.querySelector('.inputsActivity');

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

const myButtonEvent = document.querySelectorAll('.myButtonEvent');

myButtonEvent.forEach(button => {
    button.addEventListener('click', function () {
        const popupId = this.getAttribute('data-popup-id');
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'block';
        }
    });
});

const myButtonEventEdit = document.querySelectorAll('.myButtonEventEdit');

myButtonEventEdit.forEach(button => {
    button.addEventListener('click', function () {
        const popupId = this.getAttribute('data-popup-id');
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'block';
        }
    });
});

const myButtonEventDelete = document.querySelectorAll('.myButtonEventDelete');

myButtonEventDelete.forEach(button => {
    button.addEventListener('click', function () {
        const popupId = this.getAttribute('data-popup-id');
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'block';
        }
    });
});

const myButtonActivityAdd = document.querySelectorAll('.myButtonActivityAdd');

myButtonActivityAdd.forEach(button => {
    button.addEventListener('click', function () {
        console.log('ok');
        const popupId = this.getAttribute('data-popup-id');
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'block';
        }
    });
});

const myButtonActivityEdit = document.querySelectorAll('.myButtonActivityEdit');

myButtonActivityEdit.forEach(button => {
    button.addEventListener('click', function () {
        const popupId = this.getAttribute('data-popup-id');
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'block';
        }
    });
});

const myButtonActivityDelete = document.querySelectorAll('.myButtonActivityDelete');

myButtonActivityDelete.forEach(button => {
    button.addEventListener('click', function () {
        console.log('ok');
        const popupId = this.getAttribute('data-popup-id');
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'block';
        }
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

const confirmButtons = document.querySelectorAll('.confirmButton');

confirmButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        // Collect form data from input fields
        const formData = {
            eventnameInput: document.getElementById('eventnameInput').value,
            startDateEvent: document.getElementById('startDateEvent').value,
            endDateEvent: document.getElementById('endDateEvent').value,
            eventScope: document.getElementById('eventScope').textContent,
            eventDays: document.getElementById('eventDays').value,
        };

        // Send the data to the server using the Fetch API
        fetch('/insert-event-database', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error sending data to the server');
                    throw new Error('Server error');
                }
            })
            .then((data) => {
                const successResponse = document.getElementById('successResponse');
                successResponse.textContent = data.message;

                successResponse.classList.remove("hidden");
                successResponse.classList.add("user-prompt", "slide-in");
                setTimeout(function () {
                    successResponse.classList.add("hidden");
                    // Close the popup after successfully submitting the form
                    const popupId = this.getAttribute('data-popup-id');
                    const popup = document.getElementById(popupId);
                    if (popup) {
                        popup.style.display = 'none';
                    }
                }, 4000);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});


// Get references to the date input elements
const startDateInput = document.getElementById('startDateEvent');
const endDateInput = document.getElementById('endDateEvent');

// Get the input element for storing the number of days
const eventDaysInput = document.getElementById('eventDays');

// Get the current date in the format YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// Set the minimum date for startDateEvent to today
startDateInput.min = today;

// Add an event listener to startDateEvent to update endDateEvent constraints
startDateInput.addEventListener('change', function () {
    // Set the minimum date for endDateEvent to the selected startDateEvent
    endDateInput.min = this.value;

    // Calculate the maximum date for endDateEvent (7 days from startDateEvent)
    const maxDate = new Date(this.value);
    maxDate.setDate(maxDate.getDate() + 7);

    // Set the maximum date for endDateEvent
    endDateInput.max = maxDate.toISOString().split('T')[0];

    // Calculate and update the number of days
    updateEventDays();
});

// Add an event listener to endDateEvent to update startDateEvent constraints
endDateInput.addEventListener('change', function () {
    // Set the maximum date for startDateEvent to the selected endDateEvent
    startDateInput.max = this.value;

    // Calculate and update the number of days
    updateEventDays();
});

// Function to calculate and update the number of days
function updateEventDays() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);


    // Calculate the difference in days
    const timeDifference = endDate - startDate + 1;
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // Update the eventDays input element with the calculated number of days
    eventDaysInput.value = daysDifference;

}