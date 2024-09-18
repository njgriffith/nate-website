document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())  // Fetch and parse the JSON file
        .then(data => {       
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    // dynamically create image with link
                    const coverItem = document.createElement('div');
                    coverItem.classList.add('grid-item');

                    const img = document.createElement('img');
                    img.src = `../resources/albums/covers/${key}.jpg`
                    img.classList.add('cover');
                    const imageLink = document.createElement('a');
                    imageLink.href = `/templates/album-review.html?album=${key}`;
                    imageLink.classList.add('image-link');

                    imageLink.appendChild(img);
                    coverItem.appendChild(imageLink);
                    gridContainer.appendChild(coverItem);

                    // create title
                    const titleItem = document.createElement('div');
                    titleItem.classList.add('grid-item');
                    const title = document.createElement('p');
                    title.textContent = `${data[key].title}`;
                    titleItem.appendChild(title);

                    // create artist
                    const artistItem = document.createElement('div');
                    artistItem.classList.add('grid-item');
                    const artist = document.createElement('p');
                    artist.textContent = `${data[key].artist}`;
                    artistItem.appendChild(artist);

                    // create score
                    const scoreItem = document.createElement('div');
                    scoreItem.classList.add('grid-item');
                    const score = document.createElement('p');
                    score.textContent = `${data[key].score}`;
                    scoreItem.appendChild(score);

                    // create review link
                    const linkItem = document.createElement('div');
                    linkItem.classList.add('grid-item');
                    const link = document.createElement('a');
                    link.classList.add('text-link');
                    link.href = `/templates/album-review.html?album=${key}`;
                    link.textContent = "Full Review";
                    linkItem.appendChild(link);

                    // append items to page
                    gridContainer.appendChild(coverItem);
                    gridContainer.appendChild(titleItem);
                    gridContainer.appendChild(artistItem);
                    gridContainer.appendChild(scoreItem);
                    gridContainer.appendChild(linkItem);
                }
                
            }
        })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
});


