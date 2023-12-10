function searchStudentProfile() {
    const idNumberInput = document.getElementById('gridsearchIDNumber');
    if (!idNumberInput) {
        console.log('Element with ID "gridsearchIDNumber" not found');
        return;
    }

    const idNumber = idNumberInput.value;
    console.log('Sending request with ID number:', idNumber);

    // Send a request to the server to search for the student profile
    fetch(`/student-participation-record/search?gridsearchIDNumber=${idNumber}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                alert('Error: Student not found.');
                throw new Error('Student not found');
            }
        })
        .then(data => {
            if (data.studentFound) {
                console.log("okok", idNumber);
                window.location.href = `/student-participation-record?id_number=${data.studentData.id_number}`;
            } else {
                alert('Student not found.');
            }
        })
        .catch(error => {
            console.error('Error searching for student: ', error);
        });
}

document.getElementById('searchButton').addEventListener('click', searchStudentProfile);
document.getElementById('gridsearchIDNumber').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchStudentProfile();
    }
});