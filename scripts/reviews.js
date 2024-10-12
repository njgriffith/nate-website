function sortData(columnName, sortDirection) {
    const gridContainer = document.getElementById('grid-container');
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())  // Fetch and parse the JSON file
        .then(data => {
            var sort = columnName;

            const entries = Object.entries(data);

            if (sort === "title"){
                entries.sort((a, b) => {
                    if (sortDirection === 'desc'){
                        return a[1].title.localeCompare(b[1].title);
                    }
                    return b[1].title.localeCompare(a[1].title);
                });
            }
            else if (sort === "artist"){
                entries.sort((a, b) => {
                    if (sortDirection === 'desc'){
                        return a[1].artist.localeCompare(b[1].artist);
                    }
                    return b[1].artist.localeCompare(a[1].artist);
                });
            }
            else if (sort === "score"){
                entries.sort((a, b) => {
                    if (sortDirection === 'desc'){
                        if (a[1].score === 10 && b[1].score === 10){
                            return a[1].rank - b[1].rank;
                        }
                        else{
                            return b[1].score - a[1].score;
                        }
                    }
                    if (a[1].score === 10 && b[1].score === 10){
                        return b[1].rank - a[1].rank;
                    }
                    else{
                        return a[1].score - b[1].score;
                    }               
                });
            }
            else if (sort === "released"){
                entries.sort((a, b) => {
                    aValue = new Date(a[1].released);
                    bValue = new Date(b[1].released);
                    if (sortDirection === 'desc'){
                        return bValue - aValue;
                    }
                    return aValue - bValue;
                });
            }
            else if (sort === "reviewed"){
                entries.sort((a, b) => {
                    aValue = new Date(a[1].reviewed);
                    bValue = new Date(b[1].reviewed);
                    if (sortDirection === 'desc'){
                        return bValue - aValue;
                    }
                    return aValue - bValue;
                });
            }
            const sortedData = Object.fromEntries(entries);

            for (let key in sortedData) {
                if (sortedData.hasOwnProperty(key)) {
                    // dynamically create image with link
                    const coverItem = document.createElement('div');
                    coverItem.classList.add('grid-item');

                    const img = document.createElement('img');
                    // img.src = `../resources/albums/covers/${key}.jpg`
                    img.src = `${sortedData[key].cover}`
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
                    // row.appendChild(linkItem);

                    gridContainer.appendChild(row);
                }
                
            }
        })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
};

let sortDirection = 'desc'; // Default sort direction
function sortAndReloadContent(columnName, element) {
    if (element === null){
        const arrow = document.getElementById(columnName.toLowerCase() + '-arrow');
        arrow.classList.add('sort-desc');
        sortData(columnName, sortDirection);
        return;
    }

    var sortName = element.childNodes[0].nodeValue.trim().toLowerCase();
    const arrow = element.querySelector('span');

    if (arrow.classList.contains('sort-desc')) {
        sortDirection = 'asc';
    } else {
        sortDirection = 'desc';
    }
    // Remove sort classes from all headers
    document.querySelectorAll('.sort-arrow').forEach(sortArrow => {
        sortArrow.classList.remove('sort-asc', 'sort-desc');
    });
    arrow.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
    if (sortDirection === 'asc'){
        arrow.innerText = '▲';
    }
    else{
        arrow.innerText = '▼';
    }
    
    
    const divs = document.querySelectorAll('.grid-row');
    divs.forEach(div => {
        div.remove();
    });
    sortData(columnName, sortDirection);
}

sortAndReloadContent('reviewed', null);

function getRandomReview(){
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())
        .then(data => {
            let index = Math.trunc(Math.random() * Object.keys(data).length);
            const keys = Object.keys(data);
            window.location.href=`/templates/album-review.html?album=${keys[index]}`;
        });
}
