// Dark/Light Mode Toggle
const body = document.body;
const modeToggleIcon = document.getElementById('modeToggle');

// Load saved mode from localStorage
if (localStorage.getItem('mode') === 'dark-mode') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    modeToggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
}

// Toggle between dark and light modes
modeToggleIcon.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');

    // Update icon based on current mode
    if (body.classList.contains('dark-mode')) {
        modeToggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('mode', 'dark-mode');
    } else {
        modeToggleIcon.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('mode', 'light-mode');
    }
});

// Get elements
const uploadSection = document.getElementById('uploadSection');
const summarySection = document.getElementById('summarySection');
const uploadForm = document.getElementById('uploadForm');
const summaryText = document.getElementById('summaryText');
const backButton = document.getElementById('backButton');
const summarizeButton = document.querySelector('.summarize-btn'); // Button for summarizing

// File Upload and Summary Logic
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file');

    // Disable button to prevent multiple clicks
    summarizeButton.disabled = true;
    summarizeButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;

    // Show processing message
    summaryText.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating summary...`;

    // Create FormData object
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        // Simulate Processing Effect
        setTimeout(async () => {
            // Send file to backend
            const response = await fetch('/summarize', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                summaryText.textContent = data.summary || 'No summary generated.';
            } else {
                summaryText.textContent = `Error: ${data.error}`;
            }

            // Hide Upload section and Show Summary section
            uploadSection.style.display = 'none';
            summarySection.style.display = 'block';

            // Re-enable button after processing
            summarizeButton.disabled = false;
            summarizeButton.innerHTML = `<i class="fas fa-check"></i> Summarize`;

        }, 2000); // Simulating a delay of 2 seconds

    } catch (error) {
        summaryText.textContent = `Error: ${error.message}`;
        summarizeButton.disabled = false;
        summarizeButton.innerHTML = `<i class="fas fa-check"></i> Summarize`;
    }
});

// Back Button Logic
backButton.addEventListener('click', () => {
    uploadSection.style.display = 'block';
    summarySection.style.display = 'none';
});
