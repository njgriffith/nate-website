function loadText() {
    fetch('/resources/albums/reviews/ants_from_up_there.txt')
        .then(response => response.text())
        .then(data => {
            // Insert the text content into the div
            document.getElementById('ants_from_up_there').textContent = data;
        })
        .catch(error => console.error('Error loading text file:', error));
}

// Call the function to load the text
loadText();
