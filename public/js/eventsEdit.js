document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("startDateEvent");
    const endDateInput = document.getElementById("endDateEvent");

    startDateInput.addEventListener("change", function () {
        endDateInput.min = startDateInput.value;
    });

    // Function to set activity date range based on input fields
    function setActivityDateRangeFromInputs() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        setActivityDateRange(startDate, endDate);
    }

    // Function to set activity date range based on local storage
    function setActivityDateRangeFromStorage() {
        const startDate = new Date(localStorage.getItem("startDateEvent"));
        const endDate = new Date(localStorage.getItem("endDateEvent"));
        setActivityDateRange(startDate, endDate);
    }

    // Function to set activity date range
    function setActivityDateRange(startDate, endDate) {
        // Adjust for time zone offset
        const timezoneOffset = startDate.getTimezoneOffset();
        startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
        endDate.setMinutes(endDate.getMinutes() - timezoneOffset);

        // Select all activitydate inputs dynamically
        const activityDateInputs = document.querySelectorAll("input[name='activitydate[]']");
        const activityDateInputsRecord = document.querySelectorAll("input[name='activitydateRecord[]']");

        activityDateInputs.forEach(function (activityDateInput) {
            activityDateInput.min = startDate.toISOString().split("T")[0];
            activityDateInput.max = endDate.toISOString().split("T")[0];
        });

        activityDateInputsRecord.forEach(function (activityDateInputRecord) {
            activityDateInputRecord.min = startDate.toISOString().split("T")[0];
            activityDateInputRecord.max = endDate.toISOString().split("T")[0];
        });
    }

    // Add event listeners for date inputs
    startDateInput.addEventListener("change", setActivityDateRangeFromInputs);
    endDateInput.addEventListener("change", setActivityDateRangeFromInputs);


    const addMoreButtons = document.querySelectorAll(".addMore");

    addMoreButtons.forEach(function (addMoreButton) {
        addMoreButton.addEventListener("click", function () {
            // Find the corresponding '.inputs' container for this button
            let inputs = document.querySelector(".inputs");

            let newInputName = document.createElement("input");
            newInputName.id = "activityname";
            newInputName.type = "text";
            newInputName.placeholder = "Activity Name";
            newInputName.name = "activityname[]";
            newInputName.classList.add("activityname-main", "add-event-inputs");

            let newInputDate = document.createElement("input");
            newInputDate.id = "activitydate";
            newInputDate.type = "date";
            newInputDate.name = "activitydate[]";
            newInputDate.classList.add("activitydate", "add-event-inputs");

            inputs.appendChild(newInputName);
            inputs.appendChild(newInputDate);

            // Trigger the updateActivityDateRange function for the new date input
            setActivityDateRangeFromInputs();

            // Update activity date range when the new date input changes
            newInputDate.addEventListener("change", setActivityDateRangeFromInputs);
        });
    });

    const addMoreActivitiesButtons = document.querySelectorAll(".addMoreActivities");

    addMoreActivitiesButtons.forEach(function (addMoreActivitiesButton) {
        addMoreActivitiesButton.addEventListener("click", function () {
            // Find the corresponding '.inputs' container for this button
            let inputs = document.querySelector(".inputsActivity");

            let newInputName = document.createElement("input");
            newInputName.type = "text";
            newInputName.id = "recordActivityName";
            newInputName.placeholder = "Activity Name";
            newInputName.name = "activitynameRecord[]";
            newInputName.classList.add("activityname-main", "add-activity-inputs");

            let newInputDate = document.createElement("input");
            newInputDate.type = "date";
            newInputDate.id = "recordActivityDate";
            newInputDate.name = "activitydateRecord[]";
            newInputDate.classList.add("activitydate", "add-activity-inputs");

            inputs.appendChild(newInputName);
            inputs.appendChild(newInputDate);

            setActivityDateRangeFromStorage();

            // Update activity date range when the new date input changes
            newInputDate.addEventListener("change", setActivityDateRangeFromStorage);
        });
    });

    document.body.addEventListener("click", function (event) {
        const clickedElement = event.target;
        const eventNameElement = clickedElement.closest(".nav-link .eventNameSpecific");

        if (eventNameElement) {
            event.preventDefault();

            const eventName = eventNameElement.textContent.trim();

            fetch(`/university-events-admin/eventroute?eventNameSpecific=${eventName}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Server response:", data);

                    localStorage.setItem("eventData", JSON.stringify(data));

                    const eventId = data.eventData.event_id;
                    localStorage.setItem("currentEventId", eventId);

                    // Extract the start and end dates from the fetched event data
                    const startDate = new Date(data.eventData.event_date_start);
                    const endDate = new Date(data.eventData.event_date_end);
                    const numberOfDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
                    console.log("hers", startDate, endDate, numberOfDays);

                    localStorage.setItem("startDateEvent", startDate.toISOString());
                    localStorage.setItem("endDateEvent", endDate.toISOString());
                    localStorage.setItem("numberOfDays", numberOfDays);

                    setActivityDateRangeFromStorage();

                    collectAttendanceData(eventId);

                    const eventDaysDropdown = document.getElementById("activity-day-dropdown");
                    eventDaysDropdown.innerHTML = "";

                    for (let i = 1; i <= numberOfDays; i++) {
                        const option = document.createElement("option");
                        option.value = i;
                        option.text = `Day ${i}`;
                        eventDaysDropdown.appendChild(option);
                    }

                    let selectedDay = localStorage.getItem("selectedDay");
                    if (selectedDay) {
                        eventDaysDropdown.value = selectedDay;
                        // Update the page with the fetched event data and number of days
                        displayEventDetails(data, numberOfDays, selectedDay);
                    }

                    selectedDay = localStorage.getItem("selectedDay");

                    eventDaysDropdown.addEventListener("change", function () {
                        selectedDay = this.value;
                        localStorage.setItem("selectedDay", selectedDay);
                        // Update the page with the new selected day
                        displayEventDetails(data, numberOfDays, selectedDay);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching event data:", error);
                });
        }
    });

    function displayEventDetails(eventData, numberOfDays, selectedDay) {
        console.log("Event Data:", eventData);

        const recordEventName = document.getElementById("recordEventName");
        recordEventName.innerHTML = "";

        const isSAO = document.querySelector('#isSAO').value === "true";

        if (eventData && eventData.eventFound) {
            console.log("Event found:", eventData.eventData.event_name);

            recordEventName.textContent = `${eventData.eventData.event_name}`;

            // console.log("Selected Day from localStorage:", selectedDay);

            const tableBody = document.getElementById("eventTableBody");
            const attendanceTableBody = document.getElementById("attendanceTableBody");

            // Clear the table body before adding new rows
            tableBody.innerHTML = "";
            attendanceTableBody.innerHTML = "";

            // Display activities
            if (eventData.eventData.activities && eventData.eventData.activities.length > 0) {
                console.log("Clicked event ID:", eventData.eventData.event_id);

                eventData.eventData.activities.forEach((activity, index) => {
                    const row = document.createElement("tr");

                    const activityParentContainer = document.createElement("td");

                    const activityContainer = document.createElement("div");
                    activityContainer.classList.add("flex-container");
                    activityParentContainer.appendChild(activityContainer);

                    if (isSAO && eventData.eventData.event_scope !== "INSTITUTIONAL") {
                        // Remove elements if the condition is true
                        const elementsToRemove = [
                            ".edit-activity-images",
                            ".myButtonActivityEdit",
                            ".img-edit-activity-details",
                            ".myButtonActivityDelete",
                            ".img-delete-activity"
                        ];

                        elementsToRemove.forEach(selector => {
                            const element = row.querySelector(selector);
                            if (element) {
                                element.remove();
                            }
                        });

                        // Create and append the activityNameElement if it's removed due to the condition
                        const activityNameElement = document.createElement("p");
                        activityNameElement.id = `recordActivityName${index}`;
                        activityNameElement.classList.add("activityNameSpecific", "activityNameSpecificEdit");
                        activityNameElement.textContent = activity.activity_name;
                        activityNameElement.style.width = "100%";
                        activityNameElement.style.textAlign = "center";
                        activityContainer.appendChild(activityNameElement);
                    } else {
                        const editActivityImages = document.createElement("div");
                        editActivityImages.classList.add("flex-container", "edit-activity-images");
                        editActivityImages.style.width = "100%";
                        editActivityImages.style.justifyContent = "center";
                        activityContainer.appendChild(editActivityImages);

                        const myButtonActivityEdit = document.createElement("button");
                        myButtonActivityEdit.type = "button";
                        myButtonActivityEdit.id = "myButtonActivityEdit1";
                        myButtonActivityEdit.classList.add("myButtonActivityEdit", "modify-button");
                        myButtonActivityEdit.setAttribute("data-popup-id", "myPopupActivityEdit1");
                        editActivityImages.appendChild(myButtonActivityEdit);

                        const imgEditActivityDetails = document.createElement("img");
                        imgEditActivityDetails.src = "../img/Edit (1).png";
                        imgEditActivityDetails.alt = "Edit Activity";
                        imgEditActivityDetails.classList.add("img-edit-activity-details");
                        myButtonActivityEdit.appendChild(imgEditActivityDetails);

                        const myButtonActivityDelete = document.createElement("button");
                        myButtonActivityDelete.type = "button";
                        myButtonActivityDelete.id = "myButtonActivityDelete";
                        myButtonActivityDelete.classList.add("myButtonActivityDelete", "modify-button");
                        myButtonActivityDelete.setAttribute("data-popup-id", "myButtonActivityDelete");
                        editActivityImages.appendChild(myButtonActivityDelete);

                        const imgDeleteActivity = document.createElement("img");
                        imgDeleteActivity.src = "../img/Cancel.png";
                        imgDeleteActivity.alt = "Delete Activity";
                        imgDeleteActivity.classList.add("img-delete-activity");
                        myButtonActivityDelete.appendChild(imgDeleteActivity);

                        const activityNameElement = document.createElement("p");
                        activityNameElement.id = `recordActivityName${index}`;
                        activityNameElement.classList.add("activityNameSpecific", "activityNameSpecificEdit");
                        activityNameElement.textContent = activity.activity_name;
                        editActivityImages.appendChild(activityNameElement);
                    }


                    const activityDateElement = document.createElement("td");
                    activityDateElement.id = `recordActivityDate${index}`;

                    const activityDate = new Date(activity.activity_date);
                    const formattedActivityDate = `${activityDate.getMonth() + 1}/${activityDate.getDate()}/${activityDate.getFullYear()}`;
                    activityDateElement.textContent = formattedActivityDate;

                    row.appendChild(activityParentContainer);
                    row.appendChild(activityDateElement);

                    // Append the row to the table body
                    tableBody.appendChild(row);

                });

                const startDate = moment(eventData.eventData.event_date_start);
                const endDate = moment(eventData.eventData.event_date_end);
                const numberOfDays = endDate.diff(startDate, 'days') + 1;

                const dateArray = [];
                for (let i = 0; i < numberOfDays; i++) {
                    dateArray.push(startDate.clone().add(i, 'days').format('MM/DD/YYYY'));
                }

                dateArray.forEach((formattedDate, index) => {
                    const attendanceRow = document.createElement("tr");

                    const attendanceDateElement = document.createElement("td");
                    attendanceDateElement.id = `attendanceDate${index}`;
                    attendanceDateElement.textContent = formattedDate;

                    attendanceRow.appendChild(attendanceDateElement);

                    attendanceTableBody.appendChild(attendanceRow);
                });

                if (tableBody.rows.length > 5) {
                    for (let i = 5; i < tableBody.rows.length; i++) {
                        const row = tableBody.rows[i];
                        row.classList.add("hidden-row");
                        row.setAttribute("data-visible", "false");
                    }

                    const seeMoreRow = document.createElement("tr");
                    seeMoreRow.classList.add("see-more-row");
                    const seeMoreCell = document.createElement("td");
                    seeMoreCell.colSpan = 5;
                    seeMoreCell.classList.add("see-more");
                    seeMoreCell.textContent = "See More";
                    seeMoreRow.appendChild(seeMoreCell);
                    tableBody.appendChild(seeMoreRow);

                    const seeMoreButton = document.querySelector(".see-more");
                    const hiddenRows = document.querySelectorAll(".hidden-row");
                    seeMoreButton.addEventListener("click", function () {
                        hiddenRows.forEach((row) => {
                            const isVisible = row.getAttribute("data-visible") === "true";
                            row.style.display = isVisible ? "none" : "table-row";
                            row.setAttribute("data-visible", !isVisible);
                        });

                        if (seeMoreButton.textContent === "See More") {
                            seeMoreButton.textContent = "See Less";
                        } else {
                            seeMoreButton.textContent = "See More";
                        }
                    });
                }

                if (attendanceTableBody.rows.length > 5) {
                    for (let i = 5; i < attendanceTableBody.rows.length; i++) {
                        const row = attendanceTableBody.rows[i];
                        row.classList.add("hidden-row");
                        row.setAttribute("data-visible", "false");
                    }

                    const seeMoreRow = document.createElement("tr");
                    seeMoreRow.classList.add("see-more-row");
                    const seeMoreCell = document.createElement("td");
                    seeMoreCell.colSpan = 5;
                    seeMoreCell.classList.add("see-more");
                    seeMoreCell.textContent = "See More";
                    seeMoreRow.appendChild(seeMoreCell);
                    attendanceTableBody.appendChild(seeMoreRow);

                    const seeMoreButton = document.querySelector(".see-more");
                    const hiddenRows = document.querySelectorAll(".hidden-row");
                    seeMoreButton.addEventListener("click", function () {
                        hiddenRows.forEach((row) => {
                            const isVisible = row.getAttribute("data-visible") === "true";
                            row.style.display = isVisible ? "none" : "table-row";
                            row.setAttribute("data-visible", !isVisible);
                        });

                        if (seeMoreButton.textContent === "See More") {
                            seeMoreButton.textContent = "See Less";
                        } else {
                            seeMoreButton.textContent = "See More";
                        }
                    });
                }
            }
        } else {
            const errorMessageElement = recordEventName;
            errorMessageElement.textContent = "Event not found.";
            recordEventName.appendChild(errorMessageElement);
        }
    }

    const eventDataLocal = JSON.parse(localStorage.getItem("eventData"));

    const numberOfDaysLocal = localStorage.getItem("numberOfDays");
    // console.log("days", numberOfDaysLocal);

    let selectedDay = localStorage.getItem("selectedDay");
    // console.log("Selected day from localStorage:", selectedDay);

    if (!selectedDay) {
        selectedDay = "1";
    }

    // console.log("Before displaying event details - Selected day:", selectedDay);

    displayEventDetails(eventDataLocal, numberOfDaysLocal, selectedDay);

    // console.log("After displaying event details - Selected day:", selectedDay);
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
            eventScope: document.getElementById("eventScope").textContent.trim(),
            eventDays: calculateEventDays(
                document.getElementById("startDateEvent").value,
                document.getElementById("endDateEvent").value
            ),
            activities: collectActivitiesData(),
            attendance: collectAttendanceData(),
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

function collectActivitiesData(eventId) {
    const activityInputs = document.querySelectorAll("input[name='activityname[]']");
    const dateInputs = document.querySelectorAll("input[name='activitydate[]']");

    const activitiesData = [];

    activityInputs.forEach((activityInput, index) => {
        const activityName = activityInput.value;
        const activityDate = dateInputs[index].value;

        if (!activityName || !activityDate) {
            console.log("Skipping activity with undefined name, date, or eventId:", {
                activityName,
                activityDate,
                eventId,
                index,
                activityInput,
                dateInput: dateInputs[index],
            });
            return; // Skip this iteration if data is undefined
        }

        activitiesData.push({
            activityName,
            activityDate,
            eventId,
        });
    });

    return activitiesData;
}

function collectAttendanceData(eventId) {
    const startDate = new Date(localStorage.getItem("startDateEvent"));
    const endDate = new Date(localStorage.getItem("endDateEvent"));
    const numberOfDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

    const attendanceDates = [];

    for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);

        const formattedDate = currentDate.toISOString().substring(0, 10);
        attendanceDates.push({
            formattedDate,
            eventId
        });
    }

    console.log("Attendance Dates:", attendanceDates);

    return attendanceDates;
}


const confirmActivityButton = document.querySelectorAll(".confirmActivityButton");

confirmActivityButton.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        const eventId = localStorage.getItem("currentEventId");
        console.log("local curent", eventId);

        const activitiesData = insertActivitiesData(eventId);

        if (activitiesData.length === 0) {
            console.log("No activity data to insert.");
            return;
        }

        const formData = {
            eventId,
            activities: activitiesData,
        };

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

function insertActivitiesData(eventId) {
    const activityInputs = document.querySelectorAll("input[name='activitynameRecord[]']");
    const dateInputs = document.querySelectorAll("input[name='activitydateRecord[]']");

    const activitiesData = [];

    activityInputs.forEach((activityInput, index) => {
        const activityName = activityInput.value;
        const activityDate = dateInputs[index].value;

        if (!activityName || !activityDate) {
            console.log("Skipping activity with undefined name, date, or eventId:", {
                activityName,
                activityDate,
                eventId,
                index,
                activityInput,
                dateInput: dateInputs[index],
            });
            return;
        }

        activitiesData.push({
            activityName,
            activityDate,
            eventId,
        });
    });

    return activitiesData;
}


function calculateEventDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1;
}

const today = new Date().toISOString().split("T")[0];

document.getElementById("startDateEvent").min = today;
document.getElementById("endDateEvent").min = today;

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