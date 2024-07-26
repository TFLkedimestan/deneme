document.getElementById('submitButton').addEventListener('click', () => {
    const text = document.getElementById('textbox').value;
    if (text) {
        fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
            method: 'POST',
            body: JSON.stringify({ action: 'addText', text: text }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Text submitted successfully');
            document.getElementById('section1').style.display = 'none';
            document.getElementById('section2').style.display = 'flex';
            loadNextText();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error submitting text');
        });
    } else {
        alert('Please enter some text');
    }
});

document.querySelectorAll('.ratingButton').forEach(button => {
    button.addEventListener('click', () => {
        const rating = button.getAttribute('data-rating');
        processText(rating);
    });
});

function loadNextText() {
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getNextText')
        .then(response => response.json())
        .then(data => {
            if (data.text) {
                document.getElementById('textDisplay').textContent = data.text;
                document.querySelectorAll('.ratingButton').forEach(button => button.disabled = false);
            } else {
                document.getElementById('textDisplay').textContent = 'Thanks for participating, we will wait you after new sentences are added';
                document.querySelectorAll('.ratingButton').forEach(button => button.disabled = true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function processText(rating) {
    const text = document.getElementById('textDisplay').textContent;
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
        method: 'POST',
        body: JSON.stringify({ action: 'processText', text: text, rating: rating }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        loadNextText();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
