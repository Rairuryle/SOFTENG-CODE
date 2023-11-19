document.addEventListener("DOMContentLoaded", function () {
    // Function to set activity date range based on session or local storage
    function setActivityDateRangeFromStorage() {
        const startDate = new Date(sessionStorage.getItem("startDateEvent"));
        const endDate = new Date(sessionStorage.getItem("endDateEvent"));
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

    // Your existing code

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

                    sessionStorage.setItem("eventData", JSON.stringify(data));
                    localStorage.setItem("eventData", JSON.stringify(data));

                    const eventId = data.eventData.event_id;
                    sessionStorage.setItem("currentEventId", eventId);

                    // Extract the start and end dates from the fetched event data
                    const startDate = new Date(data.eventData.event_date_start);
                    const endDate = new Date(data.eventData.event_date_end);
                    const numberOfDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

                    sessionStorage.setItem("startDateEvent", startDate.toISOString());
                    sessionStorage.setItem("endDateEvent", endDate.toISOString());

                    localStorage.setItem("startDateEvent", startDate.toISOString());
                    localStorage.setItem("endDateEvent", endDate.toISOString());

                    sessionStorage.setItem("numberOfDays", numberOfDays);
                    localStorage.setItem("numberOfDays", numberOfDays);

                    // Set the activity date range based on storage
                    setActivityDateRangeFromStorage();

                    // Move the code to populate the dropdown inside this block
                    const eventDaysDropdown = document.getElementById("activity-day-dropdown");
                    eventDaysDropdown.innerHTML = "";

                    for (let i = 1; i <= numberOfDays; i++) {
                        const option = document.createElement("option");
                        option.value = i;
                        option.text = `Day ${i}`;
                        eventDaysDropdown.appendChild(option);
                    }

                    const eventName = data.eventData.event_name;

                    let selectedDay = localStorage.getItem("selectedDay");

                    if (selectedDay) {
                        eventDaysDropdown.value = selectedDay;
                        selectedDay = localStorage.getItem("selectedDay");
                        displayEventDetails(data, numberOfDays, selectedDay);
                    }

                    eventDaysDropdown.addEventListener("change", function () {
                        selectedDay = this.value;
                        localStorage.setItem("selectedDay", selectedDay);
                        displayEventDetails(data, numberOfDays, selectedDay);
                    });

                    for (let i = 0; i < data.eventData.activities.length; i++) {
                        const selectedRole = localStorage.getItem(`selectedRole_event_${eventId}_row_${i}`);
                        if (selectedRole) {
                            const selectElement = document.querySelector(`select[data-row-id="${i}"]`);
                            if (selectElement) {
                                const roleElement = selectElement.parentElement;
                                const pointsElement = roleElement.nextElementSibling;

                                if (roleElement && pointsElement) {
                                    // Instead of setting text content, let's find the option and select it
                                    const optionToSelect = [...selectElement.options].find(option => option.value === selectedRole);

                                    if (optionToSelect) {
                                        // Update the selected option in the dropdown
                                        optionToSelect.selected = true;
                                        selectElement.style.color = getComputedStyle(optionToSelect).color;

                                        let points;
                                        switch (selectedRole) {
                                            case "TEAM Participant":
                                                points = 15;
                                                break;
                                            case "INDIV Participant":
                                                points = 10;
                                                break;
                                            case "PROG. Spectator":
                                                points = 5;
                                                break;
                                            case "OTH. Spectator":
                                                points = 3;
                                                break;
                                            default:
                                                points = 0;
                                        }

                                        // Update pointsElement with calculated points
                                        pointsElement.textContent = points.toString();
                                    }
                                }
                            }
                        }
                    }

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

        const isAdminURL = document.querySelector('#isAdminURL').value === "true";

        if (eventData && eventData.eventFound) {
            console.log("Event found:", eventData.eventData.event_name);

            recordEventName.textContent = `${eventData.eventData.event_name}`;

            console.log("Selected Day from localStorage function:", selectedDay);


            // Assuming you have a table body element with the id "eventTableBody"
            const tableBody = document.getElementById("eventTableBody");

            // Clear the table body before adding new rows
            tableBody.innerHTML = "";

            // Display activities
            if (eventData.eventData.activities && eventData.eventData.activities.length > 0) {
                let eventId = eventData.eventData.event_id; // Retrieve eventId in this scope
                console.log("e", eventData.eventData.event_id);

                eventData.eventData.activities.forEach((activity, index) => {
                    const row = document.createElement("tr");

                    // Create the container for activity name and img
                    const activityParentContainer = document.createElement("td");

                    const activityNameElement = document.createElement("p");
                    activityNameElement.id = `recordActivityName${index}`;
                    activityNameElement.classList.add("activityNameSpecific", "activityNameSpecificEdit");
                    activityNameElement.textContent = activity.activity_name;

                    const activityDateElement = document.createElement("td");
                    activityDateElement.id = `recordActivityDate${index}`;
                    // Format the activity date
                    const activityDate = new Date(activity.activity_date);
                    const formattedActivityDate = `${activityDate.getMonth() + 1}/${activityDate.getDate()}/${activityDate.getFullYear()}`;
                    activityDateElement.textContent = formattedActivityDate;

                    const roleElement = document.createElement("td");

                    // Create the select element
                    const selectElement = document.createElement("select");
                    selectElement.name = "student role dropdown";
                    selectElement.classList.add("student-role-dropdown");
                    selectElement.setAttribute('data-row-id', index);

                    // Create and append options to the select element
                    const defaultOption = document.createElement("option");
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    defaultOption.textContent = "Select Student Role";
                    selectElement.appendChild(defaultOption);

                    const roles = ["INDIV Participant", "TEAM Participant", "PROG. Spectator", "OTH. Spectator"];
                    roles.forEach((role) => {
                        const option = document.createElement("option");
                        option.value = role;
                        option.textContent = role;
                        selectElement.appendChild(option);
                    });

                    roleElement.appendChild(selectElement);

                    const pointsElement = document.createElement("td");

                    // Add event listener to the select element
                    selectElement.addEventListener("change", function () {
                        const selectedRole = this.value;
                        let points;

                        switch (selectedRole) {
                            case "TEAM Participant":
                                points = 15;
                                break;
                            case "INDIV Participant":
                                points = 10;
                                break;
                            case "PROG. Spectator":
                                points = 5;
                                break;
                            case "OTH. Spectator":
                                points = 3;
                                break;
                            default:
                                points = 0; // You might want to set a default value here
                        }

                        pointsElement.textContent = points.toString();

                        // // Update the roleElement with the selected role
                        // roleElement.textContent = selectedRole;

                        // Update the color of the selected option in the select element
                        const selectedOption = this.options[this.selectedIndex];
                        this.style.color = getComputedStyle(selectedOption).color;

                        // Store the selected role in localStorage
                        localStorage.setItem(`selectedRole_event_${eventId}_row_${index}`, selectedRole);
                    });

                    const officerElement = document.createElement("td");
                    const adminData = document.getElementById("adminData");
                    let adminDataElement = adminData.textContent;
                    adminDataElement = adminDataElement.split("|").pop().trim(); // Remove string before | and trim any extra spaces

                    officerElement.textContent = adminDataElement;


                    activityParentContainer.appendChild(activityNameElement);

                    selectElement.addEventListener("change", function () {
                        var selectedOption = selectElement.options[selectElement.selectedIndex];
                        selectElement.style.color = getComputedStyle(selectedOption).color;
                    });


                    row.appendChild(activityParentContainer);
                    row.appendChild(activityDateElement);
                    row.appendChild(roleElement);
                    row.appendChild(pointsElement);
                    row.appendChild(officerElement);

                    // Append the row to the table body
                    tableBody.appendChild(row);
                });

                // Add hidden rows after the 5th row


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
            }
        } else {
            const errorMessageElement = recordEventName;
            errorMessageElement.textContent = "Event not found.";
            recordEventName.appendChild(errorMessageElement);
        }
    }

    const eventDataSession = JSON.parse(sessionStorage.getItem("eventData"));
    const eventDataLocal = JSON.parse(localStorage.getItem("eventData"));

    const numberOfDaysSession = sessionStorage.getItem("numberOfDays");
    console.log("dayse", numberOfDaysSession);
    const numberOfDaysLocal = localStorage.getItem("numberOfDays");
    console.log("days", numberOfDaysLocal);

    let selectedDay = localStorage.getItem("selectedDay");
    console.log("Selected day from localStorage:", selectedDay);

    if (!selectedDay) {
        selectedDay = "1";
        console.log("Setting default selected day to 1");
    }

    console.log("Before displaying event details - Selected day:", selectedDay);

    displayEventDetails(eventDataSession, eventDataLocal, numberOfDaysSession, numberOfDaysLocal, selectedDay);

    console.log("After displaying event details - Selected day:", selectedDay);
});

// // When the window loads, set the dropdown value for each row based on localStorage
window.addEventListener("load", function () {
    const selectElements = document.querySelectorAll(".student-role-dropdown");

    selectElements.forEach((selectElement) => {
        const rowId = selectElement.getAttribute('data-row-id'); // Retrieve the unique identifier

        // Retrieve the selected role for this specific row from localStorage
        const specificSelectedRole = localStorage.getItem(`selectedRole_row_${rowId}`);

        if (specificSelectedRole) {
            // Set the value to the previously selected role for this row
            selectElement.value = specificSelectedRole;

            // Trigger the change event to update pointsElement based on the selected role
            const changeEvent = new Event("change");
            selectElement.dispatchEvent(changeEvent);
        }
    });
});