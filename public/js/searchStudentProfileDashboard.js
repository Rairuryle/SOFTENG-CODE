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
                const isUSGorSAO = document.querySelector('#isUSGorSAO').value === "true";

                // if (isUSGorSAO) {
                window.location.href = `/university-events-admin?id_number=${data.studentData.id_number}`;
                // } else {
                //     window.location.href = `/college-events-admin?id_number=${data.studentData.id_number}`;
                // }
            } else {
                alert('Student not found.');
            }
        })
        .catch(error => {
            console.error('Error searching for student: ', error);
        });
}

document.getElementById('searchButton').addEventListener('click', searchStudentProfile);
