document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            navLinks.forEach((link) => {
                link.classList.remove("active");
            });

            this.classList.add("active");
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
});

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