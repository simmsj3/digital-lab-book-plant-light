let wavelengths = [415, 445, 480, 515, 555, 590, 630, 680];

// Load stored data on page load
window.onload = function() {
    loadTableFromStorage();
};

// Function to add a new column for student input
function addColumn() {
    console.log("Add Data Column button clicked");

    const table = document.getElementById('dataTable');
    const headerRow = table.querySelector('thead tr');

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
    newHeader.textContent = `${location} - ${date} - ${time}`;
    headerRow.appendChild(newHeader);

    // Add empty input cells for each wavelength row
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter intensity';
        input.addEventListener('input', saveTableToStorage); // Save on input
        newCell.appendChild(input);
        row.appendChild(newCell);
    });

    saveTableToStorage(); // Save after adding a column
    console.log("New column added");
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
    console.log("Table data saved to local storage");
}

// Function to load the table data from local storage
function loadTableFromStorage() {
    const storedData = localStorage.getItem('lightData');
    if (storedData) {
        const tableData = JSON.parse(storedData);

        const table = document.getElementById('dataTable');
        const headerRow = table.querySelector('thead tr');

        // Load headers
        const headers = tableData[0];
        headers.slice(1).forEach(header => {
            const newHeader = document.createElement('th');
            newHeader.textContent = header;
            headerRow.appendChild(newHeader);
        });

        // Load table data
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, rowIndex) => {
            tableData[rowIndex + 1].slice(1).forEach((cellData, colIndex) => {
                const newCell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = cellData;
                input.addEventListener('input', saveTableToStorage); // Save on input
                newCell.appendChild(input);
                row.appendChild(newCell);
            });
        });

        console.log("Table data loaded from local storage");
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

    // Create a download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "light_data.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
