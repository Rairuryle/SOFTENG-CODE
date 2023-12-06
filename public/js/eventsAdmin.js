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

                    const eventId = data.eventData.event_id;
                    const idNumber = document.getElementById('idNumberContainer').dataset.idnumber;

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

                const idNumber = document.getElementById('idNumberContainer').dataset.idnumber;
                console.log("Student ID:", idNumber);

                let totalPoints = 0;

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

                        // Recalculate totalPoints by iterating through all rows
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

                const dateArray = [];
                for (let i = 0; i < numberOfDays; i++) {
                    dateArray.push(startDate.clone().add(i, 'days').format('MM/DD/YYYY'));
                }

                dateArray.forEach((formattedDate, index) => {
                    const attendanceRow = document.createElement("tr");

                    const attendanceDateElement = document.createElement("td");
                    attendanceDateElement.id = `attendanceDate${index}`;
                    attendanceDateElement.textContent = formattedDate;

                    const loginAMElement = document.createElement("td");
                    const loginAM = document.createElement("input");
                    loginAM.type = "checkbox";
                    loginAM.classList.add("ui-checkbox");
                    loginAM.name = "checkbox";
                    loginAM.setAttribute('data-attendance-row-id', index);
                    loginAMElement.appendChild(loginAM);

                    const loginPMElement = document.createElement("td");
                    const loginPM = document.createElement("input");
                    loginPM.type = "checkbox";
                    loginPM.classList.add("ui-checkbox");
                    loginPM.name = "checkbox";
                    loginPM.setAttribute('data-attendance-row-id', index);
                    loginPMElement.appendChild(loginPM);

                    const logoutPMElement = document.createElement("td");
                    const logoutPM = document.createElement("input");
                    logoutPM.type = "checkbox";
                    logoutPM.classList.add("ui-checkbox");
                    logoutPM.name = "checkbox";
                    logoutPM.setAttribute('data-attendance-row-id', index);
                    logoutPMElement.appendChild(logoutPM);

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

                // Retrieve the subtotal from localStorage if available
                const storedSubtotal = localStorage.getItem(eventSubtotalKey);
                if (storedSubtotal) {
                    document.getElementById("attendanceSubtotal").textContent = storedSubtotal;
                }

                // Attach a single event listener to the attendanceTableBody to capture checkbox changes
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

let eventSubtotalKey;

function calculateActivitySubtotal() {
    let totalPoints = 0;
    const tableBody = document.getElementById("eventTableBody");

    tableBody.querySelectorAll('td:nth-child(4)').forEach((pointsElement) => {
        const currentPoints = parseInt(pointsElement.textContent);
        totalPoints += isNaN(currentPoints) ? 0 : currentPoints;
    });

    const activitySubtotalElement = document.getElementById('activitySubtotal');
    if (activitySubtotalElement) {
        const totalPointsText = totalPoints.toString();
        activitySubtotalElement.textContent = totalPointsText;
    }

    calculateDailyPoints();
}

function calculateAttendanceSubtotal() {
    const checkboxes = document.querySelectorAll('#attendanceTableBody input[type="checkbox"]');
    const pointsToAdd = 2; // Points to add for each checked checkbox

    let subtotal = 0;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            subtotal += pointsToAdd;
        }
    });

    // Update the attendanceSubtotal display and storage
    const attendanceSubtotalElement = document.getElementById("attendanceSubtotal");
    attendanceSubtotalElement.textContent = subtotal.toString();

    // const eventSubtotalKey = `attendanceStatus_student_${idNumber}_attendanceSubtotal_event_${eventId}`;
    localStorage.setItem(eventSubtotalKey, subtotal.toString());

    calculateDailyPoints();
}

function calculateDailyPoints() {
    const activitySubtotal = parseInt(document.getElementById('activitySubtotal').textContent);
    const attendanceSubtotal = parseInt(document.getElementById('attendanceSubtotal').textContent);

    const dailyPoints = activitySubtotal + attendanceSubtotal;

    const dailyPointsElement = document.getElementById("dailyPoints");
    if (dailyPointsElement) {
        dailyPointsElement.textContent = dailyPoints.toString();
    }

    // const eventDailyPoints = `dailyPoints_student_${idNumber}_event_${eventId}`;
    // localStorage.setItem(eventDailyPoints, dailyPoints.toString());
    // console.log("eventdp", eventDailyPoints);

    localStorage.setItem("dailyPoints", dailyPoints.toString());

    updateSemestralTotal();
}

function updateSemestralTotal() {
    let semestralTotal = 0;
    // Loop through all stored daily points and accumulate them
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes("dailyPoints")) {
            const storedDailyPoints = parseInt(localStorage.getItem(key));
            if (!isNaN(storedDailyPoints)) {
                semestralTotal += storedDailyPoints;
            }
        }
    }

    // Update the semestralPoints element
    const semestralPointsElement = document.getElementById("semestralPoints");
    if (semestralPointsElement) {
        semestralPointsElement.textContent = semestralTotal.toString();
    }
}
