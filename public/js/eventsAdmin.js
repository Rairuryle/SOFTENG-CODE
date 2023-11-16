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

                    // Retrieve the selected day from localStorage
                    const selectedDay = localStorage.getItem("selectedEventDay");

                    // Set the selected value in the dropdown
                    if (selectedDay) {
                        eventDaysDropdown.value = selectedDay;
                    }

                    // Update the page with the fetched event data and number of days
                    displayEventDetails(data, numberOfDays);
                })
                .catch((error) => {
                    console.error("Error fetching event data:", error);
                });
        }
    });

    function displayEventDetails(eventData, numberOfDays) {
        console.log("Event Data:", eventData);

        const recordEventName = document.getElementById("recordEventName");
        recordEventName.innerHTML = "";

        const isAdminURL = document.querySelector('#isAdminURL').value === "true";

        if (eventData && eventData.eventFound) {
            console.log("Event found:", eventData.eventData.event_name);

            recordEventName.textContent = `${eventData.eventData.event_name}`;

            // Assuming you have a table body element with the id "eventTableBody"
            const tableBody = document.getElementById("eventTableBody");

            // Clear the table body before adding new rows
            tableBody.innerHTML = "";

            // Display activities
            if (eventData.eventData.activities && eventData.eventData.activities.length > 0) {
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

                    // Create and append options to the select element
                    const defaultOption = document.createElement("option");
                    defaultOption.selected = true;
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

                    defaultOption.selected = true;

                    const pointsElement = document.createElement("td");
                    pointsElement.textContent = "5";

                    const officerElement = document.createElement("td");
                    const adminData = document.getElementById("adminData");
                    let adminDataElement = adminData.textContent;
                    adminDataElement = adminDataElement.split("|").pop().trim(); // Remove string before | and trim any extra spaces

                    officerElement.textContent = adminDataElement;

                    if (isAdminURL) {
                        activityParentContainer.appendChild(activityNameElement);

                        selectElement.addEventListener("change", function () {
                            var selectedOption = selectElement.options[selectElement.selectedIndex];
                            selectElement.style.color = getComputedStyle(selectedOption).color;
                        });
                    } else {
                        const activityContainer = document.createElement("div");
                        activityContainer.classList.add("flex-container");
                        activityParentContainer.appendChild(activityContainer);

                        const editActivityImages = document.createElement("div");
                        editActivityImages.classList.add("flex-container", "edit-activity-images");
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

                        editActivityImages.appendChild(activityNameElement);

                        selectElement.disabled = true;

                        defaultOption.disabled = true;
                    }

                    row.appendChild(activityParentContainer);
                    row.appendChild(activityDateElement);
                    row.appendChild(roleElement);
                    row.appendChild(pointsElement);
                    row.appendChild(officerElement);

                    // Append the row to the table body
                    tableBody.appendChild(row);

                    console.log("e", eventData.eventData.event_id);
                });

                // Add hidden rows after the 5th row
                for (let i = 5; i < tableBody.rows.length; i++) {
                    const row = tableBody.rows[i];
                    row.classList.add("hidden-row");
                    row.setAttribute("data-visible", "false");
                }

                if (tableBody.rows.length > 5) {
                    // Add "See More" button row
                    const seeMoreRow = document.createElement("tr");
                    seeMoreRow.classList.add("see-more-row");
                    const seeMoreCell = document.createElement("td");
                    seeMoreCell.colSpan = 5;
                    seeMoreCell.classList.add("see-more");
                    seeMoreCell.textContent = "See More";
                    seeMoreRow.appendChild(seeMoreCell);
                    tableBody.appendChild(seeMoreRow);
                }

                // Add event listener for "See More" button
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
        } else {
            const errorMessageElement = recordEventName;
            errorMessageElement.textContent = "Event not found.";
            recordEventName.appendChild(errorMessageElement);
        }
    }

    const eventDataSession = JSON.parse(sessionStorage.getItem("eventData"));
    const eventDataLocal = JSON.parse(localStorage.getItem("eventData"));

    const numberOfDaysSession = sessionStorage.getItem("numberOfDays");
    const numberOfDaysLocal = localStorage.getItem("numberOfDays");

    // Display the event details
    displayEventDetails(eventDataSession, eventDataLocal, numberOfDaysSession, numberOfDaysLocal);
});