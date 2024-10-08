document.addEventListener("DOMContentLoaded", function () {

    // Object.filter = function (obj, func) {
    //     var res = {};

    //     for (var key in obj) {
    //         // filter out own properties (not length) that pass the filter function
    //         if (obj.hasOwnProperty(key) && key !== "length" && func(key, obj[key])) {
    //             res[key] = obj[key];
    //             console.log("res", res[key]);
    //         }
    //     };

    //     return res;
    // };

    // var filtered = Object.filter(localStorage, function (i, v) {
    //     return ~i.indexOf("dailyPoints");
    // });

    // $.each(filtered, function (i, v) {
    //     console.log("each", i, v);
    // });

    // Function to set activity date range based local storage
    function setActivityDateRangeFromStorage() {
        const startDate = new Date(localStorage.getItem("startDateEvent"));
        const endDate = new Date(localStorage.getItem("endDateEvent"));
        setActivityDateRange(startDate, endDate);
    }

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

                    localStorage.setItem("eventData", JSON.stringify(data));

                    eventId = data.eventData.event_id;

                    eventStudentID = `student_ID_${idNumber}_event_ID_${eventId}`;
                    localStorage.setItem("eventStudentID", eventStudentID);

                    // Extract the start and end dates from the fetched event data
                    const startDate = moment(data.eventData.event_date_start);
                    const endDate = moment(data.eventData.event_date_end);
                    const numberOfDays = endDate.diff(startDate, 'days') + 1;

                    localStorage.setItem("startDateEvent", startDate.toISOString());
                    localStorage.setItem("endDateEvent", endDate.toISOString());
                    localStorage.setItem("numberOfDays", numberOfDays);

                    setActivityDateRangeFromStorage();

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
                        selectedDay = localStorage.getItem("selectedDay");
                        displayEventDetails(data, numberOfDays, selectedDay);
                    }

                    eventDaysDropdown.addEventListener("change", function () {
                        selectedDay = this.value;
                        localStorage.setItem("selectedDay", selectedDay);
                        displayEventDetails(data, numberOfDays, selectedDay);
                    });


                    for (let i = 0; i < data.eventData.activities.length; i++) {
                        const selectedRole = localStorage.getItem(`selectedRole_student_${idNumber}_event_${eventId}_row_${i}`);
                        const officerStoredValue = localStorage.getItem(`officerElement_student_${idNumber}_event_${eventId}_row_${i}`);
                        if (selectedRole) {
                            const selectElement = document.querySelector(`select[data-row-id="${i}"]`);
                            if (selectElement) {

                                const roleElement = selectElement.parentElement;
                                const pointsElement = roleElement.nextElementSibling;
                                const officerElement = pointsElement.nextElementSibling;

                                if (roleElement && pointsElement) {
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
                                        pointsElement.textContent = points.toString();
                                        officerElement.textContent = officerStoredValue;
                                    }
                                }
                            }
                        }
                    }
                    calculateActivitySubtotal();
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
        const isCSO = document.querySelector('#isCSO').value === "true";

        const isCSOorSAO = isCSO || isSAO;

        if (eventData && eventData.eventFound) {
            console.log("Event found:", eventData.eventData.event_name);

            recordEventName.textContent = `${eventData.eventData.event_name}`;

            // console.log("Selected Day from localStorage function:", selectedDay);

            const tableBody = document.getElementById("eventTableBody");
            const attendanceTableBody = document.getElementById("attendanceTableBody");

            // Clear the table body before adding new rows
            tableBody.innerHTML = "";
            attendanceTableBody.innerHTML = "";

            // Display activities
            if (eventData.eventData.activities && eventData.eventData.activities.length > 0) {
                const eventId = eventData.eventData.event_id;
                console.log("Clicked event ID:", eventData.eventData.event_id);

                // let totalPoints = 0;

                eventData.eventData.activities.forEach((activity, index) => {
                    const row = document.createElement("tr");
                    const activityParentContainer = document.createElement("td");

                    const activityNameElement = document.createElement("p");
                    activityNameElement.id = `recordActivityName${index}`;
                    activityNameElement.classList.add("activityNameSpecific", "activityNameSpecificEdit");
                    activityNameElement.textContent = activity.activity_name;
                    activityParentContainer.appendChild(activityNameElement);

                    const activityDateElement = document.createElement("td");
                    activityDateElement.id = `recordActivityDate${index}`;
                    const activityDate = new Date(activity.activity_date);
                    const formattedActivityDate = `${activityDate.getMonth() + 1}/${activityDate.getDate()}/${activityDate.getFullYear()}`;
                    activityDateElement.textContent = formattedActivityDate;

                    const roleElement = document.createElement("td");

                    const selectElement = document.createElement("select");
                    selectElement.name = "student role dropdown";
                    selectElement.classList.add("student-role-dropdown");
                    selectElement.setAttribute('data-row-id', index);

                    if (isCSOorSAO) {
                        selectElement.disabled = true;
                    }

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
                    const officerElement = document.createElement("td");

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
                                points = 0;
                        }

                        // Get the row index of the changed select element
                        const rowIndex = parseInt(this.getAttribute('data-row-id'));

                        // Update the points for the specific row
                        const pointsElement = tableBody.rows[rowIndex].querySelector('td:nth-child(4)');
                        pointsElement.textContent = points.toString();

                        calculateActivitySubtotal();

                        const adminData = document.getElementById("adminData");
                        let adminDataElement = tableBody.rows[rowIndex].querySelector('td:nth-child(5)');
                        adminDataElement = adminData.textContent;
                        adminDataElement = adminDataElement.split("|").pop().trim();

                        officerElement.textContent = adminDataElement;

                        const selectedOption = this.options[this.selectedIndex];
                        this.style.color = getComputedStyle(selectedOption).color;

                        localStorage.setItem(`selectedRole_student_${idNumber}_event_${eventId}_row_${rowIndex}`, selectedRole);
                        localStorage.setItem(`officerElement_student_${idNumber}_event_${eventId}_row_${rowIndex}`, adminDataElement);
                    });

                    row.appendChild(activityParentContainer);
                    row.appendChild(activityDateElement);
                    row.appendChild(roleElement);
                    row.appendChild(pointsElement);
                    row.appendChild(officerElement);

                    tableBody.appendChild(row);
                });

                calculateActivitySubtotal();

                const startDate = moment(eventData.eventData.event_date_start);
                const endDate = moment(eventData.eventData.event_date_end);
                const numberOfDays = endDate.diff(startDate, 'days') + 1;

                function createCheckbox(type, index) {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.classList.add("ui-checkbox");
                    checkbox.name = "checkbox";
                    checkbox.setAttribute('data-attendance-row-id', index);

                    const checkboxElement = document.createElement("td");
                    checkboxElement.appendChild(checkbox);

                    if (isCSOorSAO) {
                        checkboxElement.classList.add("disabled-checkbox");
                    }

                    return checkboxElement;
                }

                const dateArray = [];
                for (let i = 0; i < numberOfDays; i++) {
                    dateArray.push(startDate.clone().add(i, 'days').format('MM/DD/YYYY'));
                }

                dateArray.forEach((formattedDate, index) => {
                    const attendanceRow = document.createElement("tr");

                    const attendanceDateElement = document.createElement("td");
                    attendanceDateElement.id = `attendanceDate${index}`;
                    attendanceDateElement.textContent = formattedDate;

                    const loginAMElement = createCheckbox("loginAM", index);
                    const loginPMElement = createCheckbox("loginPM", index);
                    const logoutPMElement = createCheckbox("logoutPM", index);

                    // const loginAMElement = document.createElement("td");
                    // const loginAM = document.createElement("input");
                    // loginAM.type = "checkbox";
                    // loginAM.classList.add("ui-checkbox");
                    // loginAM.name = "checkbox";
                    // loginAM.setAttribute('data-attendance-row-id', index);
                    // loginAMElement.appendChild(loginAM);

                    // const loginPMElement = document.createElement("td");
                    // const loginPM = document.createElement("input");
                    // loginPM.type = "checkbox";
                    // loginPM.classList.add("ui-checkbox");
                    // loginPM.name = "checkbox";
                    // loginPM.setAttribute('data-attendance-row-id', index);
                    // loginPMElement.appendChild(loginPM);

                    // const logoutPMElement = document.createElement("td");
                    // const logoutPM = document.createElement("input");
                    // logoutPM.type = "checkbox";
                    // logoutPM.classList.add("ui-checkbox");
                    // logoutPM.name = "checkbox";
                    // logoutPM.setAttribute('data-attendance-row-id', index);
                    // logoutPMElement.appendChild(logoutPM);

                    // if (isSAO && eventData.eventData.event_scope !== "INSTITUTIONAL") {
                    //     loginAMElement.classList.add("disabled-checkbox");
                    //     loginPMElement.classList.add("disabled-checkbox");
                    //     logoutPMElement.classList.add("disabled-checkbox");
                    // }

                    attendanceRow.appendChild(attendanceDateElement);
                    attendanceRow.appendChild(loginAMElement);
                    attendanceRow.appendChild(loginPMElement);
                    attendanceRow.appendChild(logoutPMElement);

                    const checkboxesInRow = attendanceRow.querySelectorAll('input[type="checkbox"]');
                    checkboxesInRow.forEach((checkbox) => {
                        const attendanceRowId = checkbox.getAttribute('data-attendance-row-id');
                        const parentTD = checkbox.closest('td');
                        const parentTDIndex = Array.from(parentTD.parentNode.children).indexOf(parentTD);
                        const checkboxKey = `attendanceStatus_student_${idNumber}_event_${eventId}_row_${attendanceRowId}_td_${parentTDIndex}_day_${formattedDate}`;

                        // console.log(attendanceRowId, parentTDIndex, formattedDate);

                        const checkboxState = localStorage.getItem(checkboxKey);
                        if (checkboxState === 'true') {
                            checkbox.checked = true;
                        }

                        checkbox.addEventListener('change', function () {
                            localStorage.setItem(checkboxKey, checkbox.checked.toString());
                        });
                    });

                    attendanceTableBody.appendChild(attendanceRow);
                });

                // const checkboxes = document.querySelectorAll('#attendanceTableBody input[type="checkbox"]');
                eventSubtotalKey = `attendanceStatus_student_${idNumber}_attendanceSubtotal_event_${eventId}`;

                const handleCheckboxChange = () => {
                    calculateAttendanceSubtotal();
                };

                const storedSubtotal = localStorage.getItem(eventSubtotalKey);
                if (storedSubtotal) {
                    document.getElementById("attendanceSubtotal").textContent = storedSubtotal;
                }

                attendanceTableBody.addEventListener('change', handleCheckboxChange);

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
        // console.log("Setting default selected day to 1");
    }

    // console.log("Before displaying event details - Selected day:", selectedDay);

    displayEventDetails(eventDataLocal, numberOfDaysLocal, selectedDay);

    // console.log("After displaying event details - Selected day:", selectedDay);

    // var _lsTotal = 0, _xLen, _x; for (_x in localStorage) { if (!localStorage.hasOwnProperty(_x)) { continue; } _xLen = ((localStorage[_x].length + _x.length) * 2); _lsTotal += _xLen; console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB") }; console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");

    // const usage = (JSON.stringify(localStorage).length / 1024);
    // console.log(usage + "KB");
});

let eventStudentID;
let eventSubtotalKey;

let idNumber = document.getElementById('idNumberContainer').dataset.idnumber;
let eventId;
console.log("Student ID:", idNumber);

// Function to initialize the event page
function initializeEventPage(idNumber, eventId) {
    // Ensure eventId is assigned before loading the state
    if (eventId) {
        loadVerificationCheckboxState(idNumber, eventId);
    } else {
        console.error("Event ID is not defined.");
    }
}

// Function to load the saved checkbox state on page load
function loadVerificationCheckboxState(idNumber, eventId) {
    const verificationCheckbox = document.querySelector('.verification-check input[type="checkbox"]');
    const key = `student_${idNumber}_event_${eventId}_verificationChecked`;

    const savedState = localStorage.getItem(key);
    console.log(`Loading saved state for: Key = ${key}, Saved state = ${savedState}`);

    if (savedState !== null) {
        verificationCheckbox.checked = savedState === 'true';
    } else {
        verificationCheckbox.checked = false;
    }
}

// Add event listener for the verification checkbox
document.querySelector('.verification-check input[type="checkbox"]').addEventListener('change', function () {
    const verificationCheckbox = this; // Use `this` to reference the checkbox
    const key = `student_${idNumber}_event_${eventId}_verificationChecked`;
    const value = verificationCheckbox.checked;

    // Save the current state of the checkbox in localStorage
    localStorage.setItem(key, value.toString());
    console.log(`Saved verification checkbox: Key = ${key}, Value = ${value}`);

    // Recalculate daily points if the checkbox is checked
    calculateDailyPoints(idNumber, eventId);
});

// Function to calculate the activity subtotal
function calculateActivitySubtotal() {
    let totalPoints = 0;
    const tableBody = document.getElementById("eventTableBody");

    tableBody.querySelectorAll('td:nth-child(4)').forEach((pointsElement) => {
        const currentPoints = parseInt(pointsElement.textContent);
        totalPoints += isNaN(currentPoints) ? 0 : currentPoints;
    });

    const activitySubtotalElement = document.getElementById('activitySubtotal');
    if (activitySubtotalElement) {
        activitySubtotalElement.textContent = totalPoints.toString();
    }

    // Calculate daily points after activity subtotal is updated
    calculateDailyPoints(idNumber, eventId);
}

// Function to calculate the attendance subtotal
function calculateAttendanceSubtotal() {
    const checkboxes = document.querySelectorAll('#attendanceTableBody input[type="checkbox"]');
    const pointsToAdd = 2;

    let subtotal = 0;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            subtotal += pointsToAdd;
        }
    });

    const attendanceSubtotalElement = document.getElementById("attendanceSubtotal");
    attendanceSubtotalElement.textContent = subtotal.toString();

    // Store attendance subtotal in localStorage for the student and event
    eventSubtotalKey = `student_${idNumber}_event_${eventId}_attendanceSubtotal`;
    localStorage.setItem(eventSubtotalKey, subtotal.toString());

    // Calculate daily points after attendance subtotal is updated
    calculateDailyPoints(idNumber, eventId);
}

// Function to calculate daily points based on activity and attendance subtotal
function calculateDailyPoints(idNumber, eventId) {
    // Check if the verification checkbox is checked
    const verificationCheckbox = document.querySelector('.verification-check input[type="checkbox"]');

    if (!verificationCheckbox.checked) {
        console.log("Verification check is not checked. Daily points will not be calculated.");
        return; // Exit the function if the checkbox is not checked
    }

    // Proceed with daily points calculation if the checkbox is checked
    const activitySubtotal = parseInt(document.getElementById('activitySubtotal').textContent);
    const attendanceSubtotal = parseInt(document.getElementById('attendanceSubtotal').textContent);

    const dailyPoints = activitySubtotal + attendanceSubtotal;

    const dailyPointsElement = document.getElementById("dailyPoints");
    if (dailyPointsElement) {
        dailyPointsElement.textContent = dailyPoints.toString();
    }

    // Store the daily points for this specific event and student
    const eventDailyPointsKey = `student_${idNumber}_event_${eventId}_dailyPoints`;
    localStorage.setItem(eventDailyPointsKey, dailyPoints.toString());

    // Recalculate the semestral total for the student
    recalculateSemestralTotal(idNumber);
}

// Function to recalculate the semestral total from all events for the student
function recalculateSemestralTotal(idNumber) {
    let semestralTotal = 0;

    // Loop through localStorage and sum all daily points for this student across events
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Check if the key corresponds to the current student's daily points for an event
        if (key.startsWith(`student_${idNumber}_event_`) && key.includes('_dailyPoints')) {
            const storedDailyPoints = parseInt(localStorage.getItem(key));
            if (!isNaN(storedDailyPoints)) {
                semestralTotal += storedDailyPoints;
            }
        }
    }

    // Update the semestral total display
    const semestralPointsElement = document.getElementById("semestralPoints");
    if (semestralPointsElement) {
        semestralPointsElement.textContent = semestralTotal.toString();
    }

    // Optionally store the semestral total if needed for later retrieval
    localStorage.setItem(`student_${idNumber}_semestralTotal`, semestralTotal.toString());
}

// Call the initialize function when navigating to a new event page
initializeEventPage(idNumber, eventId);


// Assuming you're using fetch API or Axios for making HTTP requests

// Fetch college events from the server
fetch('/college-events')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const collegeEvents = data.collegeEvents;
        console.log('College Events:', collegeEvents);
        // Further processing or rendering of the college events can be done here
    })
    .catch(error => {
        console.error('Error fetching college events:', error);
    });
