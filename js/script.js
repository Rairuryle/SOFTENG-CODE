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