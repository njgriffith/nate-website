function getRandomReview(){
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())  // Fetch and parse the JSON file
        .then(data => {
            let index = Math.trunc(Math.random() * Object.keys(data).length);
            const keys = Object.keys(data);
            window.location.href=`/templates/album-review.html?album=${keys[index]}`;
        });
}
// getRandomReview();