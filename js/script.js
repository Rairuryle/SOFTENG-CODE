document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            // Prevent the default behavior of the link
            event.preventDefault();

            // Remove the 'active' class from all links
            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            // Add the 'active' class to the clicked link
            this.classList.add("active");
        });
    });
});

var selects = document.querySelectorAll("#student-role-dropdown");

// Add an event listener to each select element
selects.forEach(function(select) {
    select.addEventListener("change", function() {
        // Get the selected option
        var selectedOption = select.options[select.selectedIndex];

        // Set the color of the selected text to match the option text color
        select.style.color = getComputedStyle(selectedOption).color;
    });
});