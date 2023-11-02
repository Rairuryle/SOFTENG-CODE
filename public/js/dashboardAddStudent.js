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

// confirmButton.addEventListener('click', function () {
//     // Extract data from the form and prepare it for submission
//     const lastNameInput = document.getElementById('lastnameInput').value;
//     const firstNameInput = document.getElementById('firstnameInput').value;
//     const middleNameInput = document.getElementById('middlenameInput').value;
//     const idNumberInput = document.getElementById('idnumberInput').value;
//     const departmentInput = document.getElementById('departmentInput').value;
//     const courseInput = document.getElementById('courseInput').value;
//     const yearInput = document.getElementById('yearInput').value;
//     const activeStatusInput = document.getElementById('activeStatusInput').value;
//     const exemptionStatusInput = document.getElementById('exemptionStatusInput').value;

//     // Create an object with the form data
//     const formData = {
//         lastnameInput,
//         firstnameInput,
//         middlenameInput,
//         idnumberInput,
//         departmentInput,
//         courseInput,
//         yearInput,
//         activeStatusInput,
//         exemptionStatusInput,
//     };

//     // Perform any additional processing if needed

//     // Submit the form with the data
//     fetch('/university-events-admin', {
//         method: 'POST',
//         body: JSON.stringify(formData),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//         .then(response => response.json())
//         .then(data => {
//             resizeBy.redirect('/university-events-admin')
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// });

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
                // Handle a successful response from the server
                // For example, you can show a success message to the user

            } else {
                // Handle errors if the server request fails
                console.error('Error sending data to the server');
            }
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
    document.getElementById('departmentInput').value = '';
    document.getElementById('courseInput').value = '';
    document.getElementById('yearInput').value = '';
    document.getElementById('activeStatusInput').value = '';
    document.getElementById('exemptionStatusInput').value = '';
}


// confirmButton.addEventListener('click', function() {
    
//     closePopupConfirmation();

    // document.getElementById('lastnameInput').value = '';
    // document.getElementById('firstnameInput').value = '';
    // document.getElementById('middlenameInput').value = '';
    // document.getElementById('idnumberInput').value = '';
    // document.getElementById('departmentInput').value = '';
    // document.getElementById('courseInput').value = '';
    // document.getElementById('yearInput').value = '';
    // document.getElementById('activeStatusInput').value = '';
    // document.getElementById('exemptionStatusInput').value = '';
// });

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
