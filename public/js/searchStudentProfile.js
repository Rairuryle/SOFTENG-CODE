function searchStudentProfile() {
    const idNumberInput = document.getElementById('gridsearchIDNumber');
    if (!idNumberInput) {
        console.log('Element with ID "gridsearchIDNumber" not found');
        return;
    }

    const idNumber = idNumberInput.value;
    console.log('Sending request with ID number:', idNumber);

    // Send a request to the server to search for the student profile
    fetch(`/university-events-admin/search?gridsearchIDNumber=${idNumber}`)
        .then(response => response.json())
        .then(data => {
            // Update the page with the search results
            if (data.studentFound) {
                const adminData = data.adminData;
                const isUSGorSAO = document.querySelector('#isUSGorSAO').value === "true";
                const isAdminURL = document.querySelector('#isAdminURL').value === "true";

                if (isAdminURL) {
                    window.location.href = `/university-events-admin?id_number=${data.studentData.id_number}`;
                } else {
                    window.location.href = `/university-events-edit?id_number=${data.studentData.id_number}`;
                }

                // if (isUSGorSAO) {
                // window.location.href = `/university-events-admin?id_number=${data.studentData.id_number}`;
                // } else {
                //     window.location.href = `/college-events-admin?id_number=${data.studentData.id_number}`;
                // }
                // Display the student's information
                const studentData = data.studentData;

                // Update your HTML to display the studentData
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