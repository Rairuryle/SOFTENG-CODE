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