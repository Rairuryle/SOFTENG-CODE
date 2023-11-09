function showPopupConfirmation() {
    const lastNameInput = document.getElementById('lastnameInput');
    const lastName = lastNameInput.value;

    const firstNameInput = document.getElementById('firstnameInput');
    const firstName = firstNameInput.value;

    const middleNameInput = document.getElementById('middlenameInput');
    const middleName = middleNameInput.value;

    const idNumberInput = document.getElementById('idnumberInput');
    const idNumber = idNumberInput.value;

    const departmentInput = document.getElementById('departmentInput');
    const department = departmentInput.value;

    const courseInput = document.getElementById('courseInput');
    const course = courseInput.value;

    const yearInput = document.getElementById('yearInput');
    const year = yearInput.value;

    const activeStatusInput = document.getElementById('activeStatusInput');
    const activeStatus = activeStatusInput.value;

    const exemptionStatusInput = document.getElementById('exemptionStatusInput');
    const exemptionStatus = exemptionStatusInput.value;

    document.getElementById("paragraphOne").innerHTML = `${lastName}, ${firstName} ${middleName}`;
    document.getElementById("paragraphTwo").innerHTML = `${idNumber}`;
    document.getElementById("paragraphThree").innerHTML = `${department}`;
    document.getElementById("paragraphFour").innerHTML = `${course} - ${year}`;
    document.getElementById("paragraphFive").innerHTML = `${activeStatus}`;
    document.getElementById("paragraphSix").innerHTML = `${exemptionStatus}`;

    const popup = document.getElementById('popupContainer');
    popup.style.display = 'block';
}

function closePopupConfirmation() {
    const popup = document.getElementById('popupContainer');
    popup.style.display = 'none';
}

let preventSubmit = true;


document.getElementById('confirmButton').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // Collect form data and send it to the server
    sendDataToServer();
    closePopupConfirmation();
    clearInputFields();
});

function sendDataToServer() {
    // Collect form data from input fields
    const formData = {
        lastnameInput: document.getElementById('lastnameInput').value,
        firstnameInput: document.getElementById('firstnameInput').value,
        middlenameInput: document.getElementById('middlenameInput').value,
        idnumberInput: document.getElementById('idnumberInput').value,
        departmentInput: document.getElementById('departmentInput').value,
        courseInput: document.getElementById('courseInput').value,
        yearInput: document.getElementById('yearInput').value,
        activeStatusInput: document.getElementById('activeStatusInput').value,
        exemptionStatusInput: document.getElementById('exemptionStatusInput').value
    };

    // Send the data to the server using the Fetch API
    fetch('/insert-into-database', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json(); // Assuming the server sends a JSON response
            } else {
                console.error('Error sending data to the server');

                const errorResponse = document.getElementById('errorResponse');
                errorResponse.textContent = `ID number is already in use`;
                errorResponse.classList.remove("hidden");
                errorResponse.classList.add("user-prompt", "slide-in");
                setTimeout(function () {
                    errorResponse.classList.add("hidden");
                }, 4000);

                throw new Error('Server error');
            }
        })
        .then((data) => {
            const successResponse = document.getElementById('successResponse');
            successResponse.textContent = data.message; // Set the content of successResponse to the response message

            successResponse.classList.remove("hidden");
            successResponse.classList.add("user-prompt", "slide-in");
            setTimeout(function () {
                successResponse.classList.add("hidden");
            }, 4000); // Hide after x seconds (adjust the duration as needed)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function clearInputFields() {
    // Reset the values of the input fields to empty strings
    document.getElementById('lastnameInput').value = '';
    document.getElementById('firstnameInput').value = '';
    document.getElementById('middlenameInput').value = '';
    document.getElementById('idnumberInput').value = '';

    const selectDepartment = document.getElementById('departmentInput');

    if (selectDepartment && selectDepartment.tagName === 'SELECT') {
        // Clear the <select> element
        selectDepartment.value = '';
    }
    document.getElementById('courseInput').value = '';
    document.getElementById('yearInput').value = '';
    document.getElementById('activeStatusInput').value = '';
    document.getElementById('exemptionStatusInput').value = '';
}

function clearInputFieldsCollege() {
    // Reset the values of the input fields to empty strings
    document.getElementById('lastnameInput').value = '';
    document.getElementById('firstnameInput').value = '';
    document.getElementById('middlenameInput').value = '';
    document.getElementById('idnumberInput').value = '';
    document.getElementById('courseInput').value = '';
    document.getElementById('yearInput').value = '';
    document.getElementById('activeStatusInput').value = '';
    document.getElementById('exemptionStatusInput').value = '';
}

const cancelButton = document.getElementById('cancelButton');
// Set a flag to prevent form submission initially

cancelButton.addEventListener('click', function () {
    const form = document.querySelector('.container-dashboard');
    form.addEventListener('submit', function (event) {
        if (preventSubmit) {
            event.preventDefault(); // Prevent form submission if the flag is true
        }
    });
    closePopupConfirmation();
});



// Attach the showPopup function to the "ADD" button click event
document.getElementById('addStudentProfile').addEventListener('click', showPopupConfirmation);
