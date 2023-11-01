function showPopupConfirmation() {
    const lastNameInput = document.getElementById('lastnameInput');
    const lastName = lastNameInput.value;
    const confirmationMessageOne = `${lastName}`;

    const firstNameInput = document.getElementById('firstnameInput');
    const firstName = firstNameInput.value;
    const confirmationMessageTwo = `${firstName}`;

    const middleNameInput = document.getElementById('middlenameInput');
    const middleName = middleNameInput.value;
    const confirmationMessageThree = `${middleName}`;

    const idNumberInput = document.getElementById('idnumberInput');
    const idNumber = idNumberInput.value;
    const confirmationMessageFour = `${idNumber}`;

    const departmentInput = document.getElementById('departmentInput');
    const department = departmentInput.value;
    const confirmationMessageFive = `${department}`;

    const courseInput = document.getElementById('courseInput');
    const course = courseInput.value;
    const confirmationMessageSix = `${course}`;

    const yearInput = document.getElementById('yearInput');
    const year = yearInput.value;
    const confirmationMessageSeven = `${year}`;

    const activeStatusInput = document.getElementById('activeStatusInput');
    const activeStatus = activeStatusInput.value;
    const confirmationMessageEight = `${activeStatus}`;

    const exemptionStatusInput = document.getElementById('exemptionStatusInput');
    const exemptionStatus = exemptionStatusInput.value;
    const confirmationMessageNine = `${exemptionStatus}`;

    document.getElementById("paragraphOne").innerHTML =
        `${confirmationMessageOne}, ${confirmationMessageTwo} ${confirmationMessageThree}`;
    document.getElementById("paragraphTwo").innerHTML = `${confirmationMessageFour}`;
    document.getElementById("paragraphThree").innerHTML = `${confirmationMessageFive}`;
    document.getElementById("paragraphFour").innerHTML = `${confirmationMessageSix} - ${confirmationMessageSeven}`;
    document.getElementById("paragraphFive").innerHTML = `${confirmationMessageEight}`;
    document.getElementById("paragraphSix").innerHTML = `${confirmationMessageNine}`;

    const popup = document.getElementById('popupContainer');
    popup.style.display = 'block';
}

function closePopupConfirmation() {
    const popup = document.getElementById('popupContainer');
    popup.style.display = 'none';
}

function confirmAction() {
    closePopupConfirmation();
    // Extract data from the form
}

// Attach the showPopup function to the "ADD" button click event
document.getElementById('addStudentProfile').addEventListener('click', showPopupConfirmation);