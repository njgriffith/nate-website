function sortData() {
    const gridContainer = document.getElementById('grid-container');
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())  // Fetch and parse the JSON file
        .then(data => {
            var sort = document.getElementById("sort");

            const entries = Object.entries(data);

            if (sort.value === "title"){
                entries.sort((a, b) => {
                    return a[1].title.localeCompare(b[1].title);
                });
            }
            else if (sort.value === "artist"){
                entries.sort((a, b) => {
                    return a[1].artist.localeCompare(b[1].artist);
                });
            }
            else if (sort.value === "score"){
                entries.sort((a, b) => {
                    if (a[1].score === 10 && b[1].score === 10){
                        return a[1].rank - b[1].rank;
                    }
                    else{
                        return b[1].score - a[1].score;
                    }
                    
                });
            }
            else if (sort.value === "released"){
                entries.sort((a, b) => {
                    aValue = new Date(a[1].released);
                    bValue = new Date(b[1].released);
                    return bValue - aValue;
                });
            }
            else if (sort.value === "reviewed"){
                entries.sort((a, b) => {
                    aValue = new Date(a[1].reviewed);
                    bValue = new Date(b[1].reviewed);
                    return bValue - aValue;
                });
            }
            const sortedData = Object.fromEntries(entries);

            for (let key in sortedData) {
                if (sortedData.hasOwnProperty(key)) {
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
                    title.textContent = `${sortedData[key].title}`;
                    titleItem.appendChild(title);

                    // create artist
                    const artistItem = document.createElement('div');
                    artistItem.classList.add('grid-item');
                    const artist = document.createElement('p');
                    artist.textContent = `${sortedData[key].artist}`;
                    artistItem.appendChild(artist);

                    // create score
                    const scoreItem = document.createElement('div');
                    scoreItem.classList.add('grid-item');
                    const score = document.createElement('p');
                    score.textContent = `${sortedData[key].score}`;
                    scoreItem.appendChild(score);

                    // create releaseDate
                    const releaseItem = document.createElement('div');
                    releaseItem.classList.add('grid-item');
                    const release = document.createElement('p');
                    release.textContent = `${sortedData[key].released}`;
                    releaseItem.appendChild(release);
                    
                    // create reviewDate
                    const reviewItem = document.createElement('div');
                    reviewItem.classList.add('grid-item');
                    const reviewDate = document.createElement('p');
                    reviewDate.textContent = `${sortedData[key].reviewed}`;
                    reviewItem.appendChild(reviewDate);

                    // create review link
                    const linkItem = document.createElement('div');
                    linkItem.classList.add('grid-item');
                    const link = document.createElement('a');
                    link.classList.add('text-link');
                    link.href = `/templates/album-review.html?album=${key}`;
                    link.textContent = "Full Review";
                    linkItem.appendChild(link);

                    // append items to row, then append row to page
                    const row = document.createElement('div');
                    row.classList.add('grid-row');
                    row.appendChild(coverItem);
                    row.appendChild(titleItem);
                    row.appendChild(artistItem);
                    row.appendChild(scoreItem);
                    row.appendChild(releaseItem);
                    row.appendChild(reviewItem);
                    row.appendChild(linkItem);

                    gridContainer.appendChild(row);
                }
                
            }
        })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
};

function sortAndReloadContent() {
    const divs = document.querySelectorAll('.grid-row');
    divs.forEach(div => {
        div.remove();
    });
    sortData();
}

document.getElementById('sort').addEventListener('change', sortAndReloadContent);

sortAndReloadContent();


