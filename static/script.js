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

// File Upload and Summary Logic
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file');
    const summaryText = document.getElementById('summaryText');

    // Clear previous summary
    summaryText.textContent = 'Generating summary...';

    // Create FormData object
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
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
    } catch (error) {
        summaryText.textContent = `Error: ${error.message}`;
    }
});