// In your /dashboard route JavaScript code

function searchStudentProfile() {
    const idNumberInput = document.getElementById('gridsearchIDNumber');
    if (!idNumberInput) {
        console.log('Element with ID "gridsearchIDNumber" not found');
        return;
    }

    const idNumber = idNumberInput.value;
    console.log('Sending request with ID number:', idNumber);

    // Send a request to the server to search for the student profile
    fetch(`/dashboard/search?gridsearchIDNumber=${idNumber}`)
        .then(response => response.json())
        .then(data => {
            if (data.studentFound) {
                // Redirect to the student's profile page (/university-events-admin) with student data as query parameters
                window.location.href = `/university-events-admin?id_number=${data.studentData.id_number}`;
            } else {
                // Display a message that the student was not found
                alert('Student not found.');
            }
        })
        .catch(error => {
            console.error('Error searching for student: ', error);
        });
}

document.getElementById('searchButton').addEventListener('click', searchStudentProfile);
