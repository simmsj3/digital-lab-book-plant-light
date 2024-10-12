let wavelengths = [415, 445, 480, 515, 555, 590, 630, 680];

// Load stored data on page load
window.onload = function() {
    loadTableFromStorage();
};

// Function to add a new column for student input
function addColumn() {
    const table = document.getElementById('dataTable');
    const headerRow = table.querySelector('thead tr');
    const select = document.getElementById('dataColumnSelect');

    // Prompt for column header information
    const location = prompt('Enter the location:');
    const date = prompt('Enter the date (YYYY-MM-DD):');
    const time = prompt('Enter the time (HH:MM):');

    if (!location || !date || !time) {
        alert("Please fill out all fields (location, date, time).");
        return;
    }

    // Add the new column header
    const newHeader = document.createElement('th');
    const colIndex = headerRow.children.length;
    newHeader.textContent = `${location} - ${date} - ${time}`;
    headerRow.appendChild(newHeader);

    // Add this new column to the dropdown for selection
    const newOption = document.createElement('option');
    newOption.value = colIndex;
    newOption.textContent = `${location} - ${date} - ${time}`;
    select.appendChild(newOption);

    // Add empty input cells for each wavelength row
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter intensity';
        input.addEventListener('input', () => {
            saveTableToStorage();
            updateHistogram(); // Update histogram after data input
        });
        newCell.appendChild(input);
        row.appendChild(newCell);
    });

    saveTableToStorage();
}

// Function to save the table data to local storage
function saveTableToStorage() {
    const table = document.getElementById('dataTable');
    const tableData = [];

    // Save headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(header => {
        headers.push(header.textContent);
    });
    tableData.push(headers);

    // Save table data rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            const input = cell.querySelector('input');
            rowData.push(input ? input.value : cell.textContent);
        });
        tableData.push(rowData);
    });

    // Store table data in local storage
    localStorage.setItem('lightData', JSON.stringify(tableData));
}

// Function to load the table data from local storage
function loadTableFromStorage() {
    const storedData = localStorage.getItem('lightData');
    const select = document.getElementById('dataColumnSelect');
    if (storedData) {
        const tableData = JSON.parse(storedData);

        const table = document.getElementById('dataTable');
        const headerRow = table.querySelector('thead tr');

        // Load headers
        const headers = tableData[0];
        headers.slice(1).forEach((header, colIndex) => {
            const newHeader = document.createElement('th');
            newHeader.textContent = header;
            headerRow.appendChild(newHeader);

            // Add each header to the dropdown
            const newOption = document.createElement('option');
            newOption.value = colIndex + 1;
            newOption.textContent = header;
            select.appendChild(newOption);
        });

        // Load table data
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, rowIndex) => {
            tableData[rowIndex + 1].slice(1).forEach((cellData, colIndex) => {
                const newCell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = cellData;
                input.addEventListener('input', () => {
                    saveTableToStorage();
                    updateHistogram(); // Update histogram after data input
                });
                newCell.appendChild(input);
                row.appendChild(newCell);
            });
        });

        updateHistogram(); // Update histogram after loading data
    }
}

// Function to download the table as a CSV file
function downloadCSV() {
    const table = document.getElementById('dataTable');
    let csvContent = "data:text/csv;charset=utf-8,";

    // Collect headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(header => {
        headers.push(header.textContent);
    });
    csvContent += headers.join(",") + "\n";

    // Collect data rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            const input = cell.querySelector('input');
            rowData.push(input ? input.value : cell.textContent);
        });
        csvContent += rowData.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "light_data.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

// Function to generate the histogram with colors based on wavelength
function updateHistogram() {
    const table = document.getElementById('dataTable');
    const allIntensities = [];
    const colors = [
        'rgba(0, 0, 255, 0.6)',  // Blue (415 nm)
        'rgba(0, 128, 255, 0.6)',  // Light Blue (445 nm)
        'rgba(0, 255, 255, 0.6)',  // Cyan (480 nm)
        'rgba(0, 255, 128, 0.6)',  // Green (515 nm)
        'rgba(255, 255, 0, 0.6)',  // Yellow (555 nm)
        'rgba(255, 165, 0, 0.6)',  // Orange (590 nm)
        'rgba(255, 69, 0, 0.6)',   // Red-Orange (630 nm)
        'rgba(255, 0, 0, 0.6)'     // Red (680 nm)
    ];

    // Collect all intensities from the table
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.querySelectorAll('td input').forEach(input => {
            if (input.value) {
                allIntensities.push(Number(input.value));
            }
        });
    });

    const ctx = document.getElementById('histogramChart').getContext('2d');
    if (window.histogramChart) {
        window.histogramChart.destroy();
    }

    window.histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: wavelengths,
            datasets: [{
                label: 'Intensity Distribution by Wavelength',
                data: allIntensities,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Wavelength (nm)',
                        font: {
                            size: 18
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Intensity',
                        font: {
                            size: 18
                        }
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });
}

function generateGraph() {
    const select = document.getElementById('dataColumnSelect');
    const colIndex = select.value;

    // Ensure a column is selected
    if (colIndex === "") {
        alert("Please select a column to generate the graph.");
        return;
    }

    const table = document.getElementById('dataTable');
    const intensityValues = [];
    const rows = table.querySelectorAll('tbody tr');

    // Validate data: Check if all intensities are entered for the selected column
    let missingData = false;
    rows.forEach(row => {
        const input = row.querySelectorAll('td input')[colIndex - 1];  // Get the input for the selected column
        if (input && input.value) {
            intensityValues.push(Number(input.value));
        } else {
            missingData = true;
        }
    });

    // If any data is missing, prompt the user to fill it in
    if (missingData) {
        alert("Please enter all intensity values for the selected column before generating the graph.");
        return;
    }

    // Bar colors corresponding to wavelength
    const colors = [
        'rgba(0, 0, 255, 0.6)',  // Blue (415 nm)
        'rgba(0, 128, 255, 0.6)',  // Light Blue (445 nm)
        'rgba(0, 255, 255, 0.6)',  // Cyan (480 nm)
        'rgba(0, 255, 128, 0.6)',  // Green (515 nm)
        'rgba(255, 255, 0, 0.6)',  // Yellow (555 nm)
        'rgba(255, 165, 0, 0.6)',  // Orange (590 nm)
        'rgba(255, 69, 0, 0.6)',   // Red-Orange (630 nm)
        'rgba(255, 0, 0, 0.6)'     // Red (680 nm)
    ];

    // Get the context for the chart
    const ctx = document.getElementById('lightChart').getContext('2d');

    // Destroy any existing chart to avoid overlap
    if (window.lineChart) {
        window.lineChart.destroy();
    }

    // Generate the histogram using Chart.js
    window.lineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: wavelengths,
            datasets: [{
                label: 'Intensity vs Wavelength',
                data: intensityValues,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.6', '1')), // Full opacity for borders
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Wavelength (nm)',
                        font: {
                            size: 18
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Intensity',
                        font: {
                            size: 18
                        }
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });
}










