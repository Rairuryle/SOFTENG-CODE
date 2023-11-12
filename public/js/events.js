document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            // Prevent the default behavior of the link
            event.preventDefault();

            // Remove the 'active' class from all links
            navLinks.forEach((link) => {
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

    function editModeDirect() {
        let url = window.location.toString();
        window.location = url.replace(/admin/, `edit`);
        console.log(window.location);
    }

    const editModeElements = document.querySelectorAll(".editMode");
    editModeElements.forEach(function (element) {
        element.addEventListener("click", editModeDirect);
    });

    function exitModeDirect() {
        let url = window.location.toString();
        window.location = url.replace(/edit/, `admin`);
        console.log(window.location);
    }

    const exitModeElements = document.querySelectorAll(".exitMode");
    exitModeElements.forEach(function (element) {
        element.addEventListener("click", exitModeDirect);
    });


    document.body.addEventListener("click", function (event) {
        const clickedElement = event.target;
        const eventNameElement = clickedElement.closest(".nav-link .eventNameSpecific");
    
        if (eventNameElement) {
            event.preventDefault();
    
            // const index = eventNameElement.className.match(/index(\d+)/)[1];
            const eventName = eventNameElement.textContent.trim();
    
            // const urlParams = new URLSearchParams(window.location.search);
            // const idNumber = urlParams.get('id_number');
    
            fetch(`/university-events-admin/eventroute?eventNameSpecific=${eventName}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Server response:", data);
    
                    sessionStorage.setItem("eventData", JSON.stringify(data));
    
                    // const isAdminURL = document.querySelector("#isAdminURL").value === "true";
                    // const redirectURL = isAdminURL
                    //     ? `/university-events-admin?id_number=${idNumber}&event_name=${encodeURIComponent(eventName)}`
                    //     : `/university-events-edit?id_number=${idNumber}&event_name=${encodeURIComponent(eventName)}`;
    
                    // window.location.href = redirectURL;
    
                    // Extract the start and end dates from the fetched event data
                    const startDate = new Date(data.eventData.event_date_start);
                    const endDate = new Date(data.eventData.event_date_end);
                    const numberOfDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

                    console.log("Number of Days:", numberOfDays);
    
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
    
        if (eventData && eventData.eventFound) {
            console.log("Event found:", eventData.eventData.event_name);

            recordEventName.textContent = `${eventData.eventData.event_name}`;
    
            const eventDaysDropdown = document.getElementById("activity-day-dropdown");
            eventDaysDropdown.innerHTML = "";
    
            for (let i = 1; i <= numberOfDays; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.text = `Day ${i}`;
                eventDaysDropdown.appendChild(option);
            }
        } else {
            const errorMessageElement = document.createElement("p");
            errorMessageElement.textContent = "Event not found.";
            recordEventName.appendChild(errorMessageElement);
        }
    }

    const eventData = JSON.parse(sessionStorage.getItem("eventData"));

    // Display the event details
    displayEventDetails(eventData);
});

// // Function to populate the activity day dropdown
// function populateActivityDayDropdown() {
//     // Clear existing options
//     activityDayDropdown.innerHTML = "";

//     // Get the number of days from the eventDays input
//     const numDays = parseInt(eventDaysInput.value);

//     // Populate options for each day
//     for (let i = 1; i <= numDays; i++) {
//         const option = document.createElement("option");
//         option.value = `DAY ${i}`;
//         option.textContent = `DAY ${i}`;
//         activityDayDropdown.appendChild(option);
//     }
// }

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
