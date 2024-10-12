let wavelengths = [415, 445, 480, 515, 555, 590, 630, 680];

// Function to add a new column for student input
function addColumn() {
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
        newCell.appendChild(input);
        row.appendChild(newCell);
    });
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
