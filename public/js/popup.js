document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("startDateEvent");
    const endDateInput = document.getElementById("endDateEvent");

    // Function to update activity date range
    function updateActivityDateRange() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        // Select all activitydate inputs dynamically
        const activityDateInputs = document.querySelectorAll("input[name='activitydate[]']");

        activityDateInputs.forEach(function (activityDateInput) {
            activityDateInput.min = startDate.toISOString().split("T")[0];
            activityDateInput.max = endDate.toISOString().split("T")[0];
        });
    }

    // Add event listeners for date inputs
    startDateInput.addEventListener("change", updateActivityDateRange);
    endDateInput.addEventListener("change", updateActivityDateRange);

    const addMoreButtons = document.querySelectorAll(".addMore");

    addMoreButtons.forEach(function (addMoreButton) {
        addMoreButton.addEventListener("click", function () {
            // Find the corresponding '.inputs' container for this button
            let inputs = document.querySelector(".inputs");

            let newInputName = document.createElement("input");
            newInputName.type = "text";
            newInputName.placeholder = "Activity Name";
            newInputName.name = "activityname[]";
            newInputName.classList.add("activityname-main");

            let newInputDate = document.createElement("input");
            newInputDate.type = "date";
            newInputDate.name = "activitydate[]";
            newInputDate.classList.add("activitydate");

            inputs.appendChild(newInputName);
            inputs.appendChild(newInputDate);

            // Trigger the updateActivityDateRange function for the new date input
            updateActivityDateRange();

            // Update activity date range when the new date input changes
            newInputDate.addEventListener("change", updateActivityDateRange);
        });
    });
});

const addMoreActivitiesButtons = document.querySelectorAll(".addMoreActivities");

addMoreActivitiesButtons.forEach(function (addMoreActivitiesButton) {
    addMoreActivitiesButton.addEventListener("click", function () {
        // Find the corresponding '.inputs' container for this button
        let inputs = document.querySelector(".inputsActivity");

        let newInputName = document.createElement("input");
        newInputName.type = "text";
        newInputName.placeholder = "Activity Name";
        newInputName.name = "activityname[]";
        newInputName.classList.add("input-style");

        let newInputDate = document.createElement("input");
        newInputDate.type = "date";
        newInputDate.name = "activitydate[]";
        newInputDate.classList.add("input-style");

        inputs.appendChild(newInputName);
        inputs.appendChild(newInputDate);
    });
});

const myButtonEvent = document.querySelectorAll(".myButtonEvent");

myButtonEvent.forEach((button) => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup-id");
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "block";
        }
    });
});

const myButtonEventEdit = document.querySelectorAll(".myButtonEventEdit");

myButtonEventEdit.forEach((button) => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup-id");
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "block";
        }
    });
});

const myButtonEventDelete = document.querySelectorAll(".myButtonEventDelete");

myButtonEventDelete.forEach((button) => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup-id");
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "block";
        }
    });
});

const myButtonActivityAdd = document.querySelectorAll(".myButtonActivityAdd");

myButtonActivityAdd.forEach((button) => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup-id");
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "block";
        }
    });
});

const myButtonActivityEdit = document.querySelectorAll(".myButtonActivityEdit");

myButtonActivityEdit.forEach((button) => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup-id");
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "block";
        }
    });
});

const myButtonActivityDelete = document.querySelectorAll(".myButtonActivityDelete");

myButtonActivityDelete.forEach((button) => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup-id");
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "block";
        }
    });
});

const closeButtons = document.querySelectorAll(".closePopup");

closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const popupId = this.getAttribute("data-popup-id");
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = "none";
        }
    });
});

const confirmButtons = document.querySelectorAll(".confirmButton");

confirmButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        const eventName = document.getElementById("eventnameInput").value;
        const eventNameUpper = eventName.toUpperCase();

        // Collect form data from input fields
        const formData = {
            eventnameInput: eventNameUpper,
            startDateEvent: document.getElementById("startDateEvent").value,
            endDateEvent: document.getElementById("endDateEvent").value,
            eventScope: document.getElementById("eventScope").textContent,
            eventDays: calculateEventDays(
                document.getElementById("startDateEvent").value,
                document.getElementById("endDateEvent").value
            ),
            activities: collectActivitiesData(),
        };

        // Send the data to the server using the Fetch API
        fetch("/insert-event-database", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    const popupId = button.getAttribute("data-popup-id");
                    const popup = document.getElementById(popupId);
                    if (popup) {
                        popup.style.display = "none";
                    }

                    console.error("Error sending data to the server");

                    const errorResponse = document.getElementById("errorResponse");
                    errorResponse.textContent = `There is already an existing event`;
                    errorResponse.classList.remove("hidden");
                    errorResponse.classList.add("user-prompt", "slide-in");
                    setTimeout(function () {
                        errorResponse.classList.add("hidden");
                    }, 4000);

                    throw new Error("Server error");
                }
            })
            .then((data) => {
                const startDate = new Date(formData.startDateEvent);
                const endDate = new Date(formData.endDateEvent);
                const numberOfDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

                document.getElementById("eventDays").value = numberOfDays;

                const popupId = button.getAttribute("data-popup-id");
                const popup = document.getElementById(popupId);
                if (popup) {
                    popup.style.display = "none";
                }

                const successResponse = document.getElementById("successResponse");
                successResponse.textContent = data.message;

                successResponse.classList.remove("hidden");
                successResponse.classList.add("user-prompt", "slide-in");
                setTimeout(function () {
                    successResponse.classList.add("hidden");
                    location.reload();
                }, 2300);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
});

function collectActivitiesData() {
    const activityInputs = document.querySelectorAll("input[name='activityname[]']");
    const dateInputs = document.querySelectorAll("input[name='activitydate[]']");

    const activitiesData = [];

    activityInputs.forEach((activityInput, index) => {
        const activityName = activityInput.value;
        const activityDate = dateInputs[index].value;

        activitiesData.push({ activityName, activityDate });
    });

    return activitiesData;
}

function calculateEventDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1;
}

const today = new Date().toISOString().split("T")[0];

const sixDaysAfterToday = new Date();
sixDaysAfterToday.setDate(sixDaysAfterToday.getDate() + 6);
const sixDaysAfterTodayString = sixDaysAfterToday.toISOString().split("T")[0];

document.getElementById("startDateEvent").min = today;
document.getElementById("endDateEvent").min = today;
document.getElementById("endDateEvent").max = sixDaysAfterTodayString;


const confirmActivityButton = document.querySelectorAll(".confirmActivityButton");

confirmActivityButton.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        // Collect form data from input fields
        const formData = {
            activityname: document.getElementById("activityname").value,
            activitydate: document.getElementById("activitydate").value
        };

        // Send the data to the server using the Fetch API
        fetch("/insert-activity-database", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    const popupId = button.getAttribute("data-popup-id");
                    const popup = document.getElementById(popupId);
                    if (popup) {
                        popup.style.display = "none";
                    }

                    console.error("Error sending data to the server");

                    // const errorResponse = document.getElementById("errorResponse");
                    // errorResponse.textContent = `There is already an existing event`;
                    // errorResponse.classList.remove("hidden");
                    // errorResponse.classList.add("user-prompt", "slide-in");
                    // setTimeout(function () {
                    //     errorResponse.classList.add("hidden");
                    // }, 4000);

                    throw new Error("Server error");
                }
            })
            .then((data) => {
                const popupId = button.getAttribute("data-popup-id");
                const popup = document.getElementById(popupId);
                if (popup) {
                    popup.style.display = "none";
                }

                const successResponse = document.getElementById("successResponse");
                successResponse.textContent = data.message;

                successResponse.classList.remove("hidden");
                successResponse.classList.add("user-prompt", "slide-in");
                setTimeout(function () {
                    successResponse.classList.add("hidden");
                    location.reload();
                }, 2300);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
});