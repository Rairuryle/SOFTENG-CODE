function searchStudentProfile() {
    const idNumberInput = document.getElementById('gridsearchIDNumber');
    if (!idNumberInput) {
        console.log('Element with ID "gridsearchIDNumber" not found');
        return;
    }

    const idNumber = idNumberInput.value;
    console.log('Sending request with ID number:', idNumber);

    fetch(`/student-participation-record/search?gridsearchIDNumber=${idNumber}`)
        .then(response => response.json())
        .then(data => {
            // Update the page with the search results
            if (data.studentFound) {

                window.location.href = `/student-participation-record?id_number=${data.studentData.id_number}`;

                const studentData = data.studentData;

                // Update HTML to display the studentData
                const studentNameElement = document.querySelector('.studentname');
                const idNumberElement = document.querySelector('.IDNumber');
                const departmentNameElement = document.querySelector('.departmentname');
                const courseNameElement = document.querySelector('.coursename');
                const yearLevelElement = document.querySelector('.yearlevel');
                const activeStatusElement = document.querySelector('.activestatus');
                const exemptionStatusElement = document.querySelector('.exemptionstatus');

                if (studentNameElement && idNumberElement && departmentNameElement && courseNameElement && yearLevelElement && activeStatusElement && exemptionStatusElement) {
                    studentNameElement.textContent = `${studentData.last_name}, ${studentData.first_name} ${studentData.middle_name}`;
                    idNumberElement.textContent = studentData.id_number;
                    departmentNameElement.textContent = studentData.department_name;
                    courseNameElement.textContent = studentData.course_name;
                    yearLevelElement.textContent = studentData.year_level;
                    activeStatusElement.textContent = studentData.active_status;
                    exemptionStatusElement.textContent = studentData.exemption_status;
                } else {
                    console.log('One or more elements not found. Ensure your HTML has the correct class names.');
                }
            } else {
                alert('Student not found.');
            }
        })
        .catch(error => {
            console.error('Error searching for student: ', error);
        });
}

document.getElementById('searchButton').addEventListener('click', searchStudentProfile);
document.getElementById('gridsearchIDNumber').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchStudentProfile();
        return false;
    }
});
