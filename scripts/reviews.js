const reviewTable = document.getElementById('review-table');
window.addEventListener('beforeunload', function () {
    const scrollableDiv = document.getElementById('scroll-div');
    if (scrollableDiv) {
        sessionStorage.setItem('scrollPosition', scrollableDiv.scrollTop);
    }
});

window.addEventListener('load', function () {
    const scrollableDiv = document.getElementById('scroll-div');
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');

    if (scrollableDiv && savedScrollPosition) {
        setTimeout(() => {
            scrollableDiv.scrollTop = parseInt(savedScrollPosition);
        }, 100);
    }
});

function sortData(columnName, sortDirection) {
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())
        .then(data => {
            var sort = columnName;
            const entries = Object.entries(data);

            if (sort === "title") {
                entries.sort((a, b) => {
                    if (sortDirection) {
                        return a[1].title.localeCompare(b[1].title);
                    }
                    return b[1].title.localeCompare(a[1].title);
                });
            }
            else if (sort === "artist") {
                entries.sort((a, b) => {
                    if (sortDirection) {
                        return a[1].artist.localeCompare(b[1].artist);
                    }
                    return b[1].artist.localeCompare(a[1].artist);
                });
            }
            else if (sort === "score") {
                entries.sort((a, b) => {
                    if (sortDirection) {
                        if (a[1].score === 10 && b[1].score === 10) {
                            return a[1].rank - b[1].rank;
                        }
                        else {
                            return b[1].score - a[1].score;
                        }
                    }
                    if (a[1].score === 10 && b[1].score === 10) {
                        return b[1].rank - a[1].rank;
                    }
                    else {
                        return a[1].score - b[1].score;
                    }
                });
            }
            else if (sort === "released") {
                entries.sort((a, b) => {
                    aValue = new Date(a[1].released);
                    bValue = new Date(b[1].released);
                    if (sortDirection) {
                        return bValue - aValue;
                    }
                    return aValue - bValue;
                });
            }
            else if (sort === "reviewed") {
                entries.sort((a, b) => {
                    aValue = new Date(a[1].reviewed);
                    bValue = new Date(b[1].reviewed);
                    if (sortDirection) {
                        return bValue - aValue;
                    }
                    return aValue - bValue;
                });
            }
            const sortedData = Object.fromEntries(entries);

            for (let key in sortedData) {
                if (sortedData.hasOwnProperty(key)) {
                    // create image
                    const coverItem = document.createElement('td');
                    const img = document.createElement('img');
                    img.src = `${sortedData[key].cover}`
                    coverItem.appendChild(img);

                    // create title
                    const titleItem = document.createElement('td');
                    titleItem.textContent = `${sortedData[key].title}`;

                    // create artist
                    const artistItem = document.createElement('td');
                    artistItem.textContent = `${sortedData[key].artist}`;

                    // create score
                    const scoreItem = document.createElement('td');
                    scoreItem.textContent = `${sortedData[key].score}`;

                    // create releaseDate
                    const releaseItem = document.createElement('td');
                    releaseItem.textContent = `${sortedData[key].released}`;

                    // create reviewDate
                    const reviewItem = document.createElement('td');
                    reviewItem.textContent = `${sortedData[key].reviewed}`;

                    // append items to row, then append row to page
                    const row = document.createElement('tr');
                    row.appendChild(coverItem);
                    row.appendChild(titleItem);
                    row.appendChild(artistItem);
                    row.appendChild(scoreItem);
                    row.appendChild(releaseItem);
                    row.appendChild(reviewItem);
                    row.setAttribute("onclick", "toReview(this)");
                    row.id=`${key}`;

                    reviewTable.appendChild(row);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
};

let sortDirection = true;
function sortAndReloadContent(columnName, element) {
    if (element === null) {
        const selected = document.getElementById('reviewed');
        selected.classList.add('selected-sort');
        sortData(columnName, sortDirection);
        return;
    }

    if (element.classList.contains('selected-sort')) {
        sortDirection = !sortDirection;
    }
    else {
        sortDirection = true;
        document.querySelectorAll('th').forEach(colTitle => {
            colTitle.classList.remove('selected-sort');
        });
        element.classList.add('selected-sort');
    }

    const divs = document.querySelectorAll('tbody>tr');
    divs.forEach(div => {
        div.remove();
    });
    sortData(columnName, sortDirection);
}

sortAndReloadContent('reviewed', null);

function getRandomReview() {
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())
        .then(data => {
            let index = Math.trunc(Math.random() * Object.keys(data).length);
            const keys = Object.keys(data);
            window.location.href = `/templates/album-review.html?album=${keys[index]}`;
        });
}
function toReview(element){
    window.location.href = `/templates/album-review.html?album=${element.id}`;
}

