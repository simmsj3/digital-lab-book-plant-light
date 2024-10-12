// Function to record the data and plot the graph
function recordData() {
    // Get form data
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const wavelengthsInput = document.getElementById('wavelengths').value;

    // Parse the wavelengths into an array of numbers
    const wavelengths = wavelengthsInput.split(',').map(Number);

    // Check if data is valid
    if (wavelengths.some(isNaN)) {
        alert('Please enter valid wavelength values separated by commas.');
        return;
    }

    // Call the plot function to update the graph
    plotGraph(wavelengths);
}

// Function to plot the data using Chart.js
function plotGraph(wavelengths) {
    const ctx = document.getElementById('lightChart').getContext('2d');

    // Remove old chart if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Create new chart
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: wavelengths.map((_, index) => `Point ${index + 1}`),
            datasets: [{
                label: 'Wavelengths (nm)',
                data: wavelengths,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Wavelength (nm)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data Points'
                    }
                }
            }
        }
    });
}
