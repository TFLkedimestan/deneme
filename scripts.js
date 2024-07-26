// Get the elements
const textbox = document.getElementById('textbox');
const submitBtn = document.getElementById('submit-btn');
const section1 = document.getElementById('section1');
const section2 = document.getElementById('section2');
const buttons = document.querySelectorAll('#section2 button');
const sheetId = 'YOUR_SHEET_ID';
const apiKey = 'YOUR_API_KEY';

// Initialize the current row and column indices
let rowIndex = 1;
let columnIndex = 1;

// Add an event listener to the submit button
submitBtn.addEventListener('click', () => {
  // Get the text from the textbox
  const text = textbox.value;

  // Send the text to Google Sheets using the API
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:append`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'majorDimension': 'ROWS',
      'range': `Sheet1!A${rowIndex}`, // Append to column A of Sheet1
      'values': [[text]]
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Hide section 1 and display section 2
    section1.style.display = 'none';
    section2.style.display = 'block';
  })
  .catch(error => console.error(error));
});

// Add event listeners to the buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Get the current text from Sheet1
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A${rowIndex}`)
      .then(response => response.json())
      .then(data => {
        const text = data.values[0][0];

        // Send the text and button value to Sheet2
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:append`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'majorDimension': 'ROWS',
            'range': `Sheet2!A${rowIndex}`, // Append to column A of Sheet2
            'values': [[text, button.textContent]]
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Clear the text from Sheet1
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A${rowIndex}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'majorDimension': 'ROWS',
              'range': `Sheet1!A${rowIndex}`,
              'values': [['']]
            })
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            // Increment the row index
            rowIndex++;

            // Check if there are more texts in Sheet1
            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A${rowIndex}`)
              .then(response => response.json())
              .then(data => {
                if (data.values.length === 0) {
                  // Display the final message
                  document.getElementById('section2').innerHTML = 'Thanks for participating, we will wait you after new sentences are added';
                } else {
                  // Go back to section 1
                  section1.style.display = 'block';
                  section2.style.display = 'none';
                }
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  });
});