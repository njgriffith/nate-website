const reviewTable = document.getElementById('review-table');
let sortColumn = 'reviewed';
let sortDirection = true;

window.addEventListener('beforeunload', function () {
    const scrollableDiv = document.getElementById('scroll-div');
    if (scrollableDiv) {
        sessionStorage.setItem('scrollPosition', scrollableDiv.scrollTop);
    }
    sessionStorage.setItem('savedSortColumn', sortColumn);
    sessionStorage.setItem('savedSortDirection', sortDirection);
});

window.addEventListener('load', function () {
    const scrollableDiv = document.getElementById('scroll-div');
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    const savedSortColumn = sessionStorage.getItem('savedSortColumn');
    const savedSortDirection = sessionStorage.getItem('savedSortDirection');

    if (scrollableDiv && savedScrollPosition) {
        setTimeout(() => {
            scrollableDiv.scrollTop = parseInt(savedScrollPosition);
        }, 100);
    }
    if (savedSortColumn) {
        sortDirection = savedSortDirection;
        sortAndReloadContent(savedSortColumn, null);
    }
    else {
        sortAndReloadContent(sortColumn, null);
    }
});

function sortData(columnName) {
    sortColumn = columnName;
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
                            return b[1].order - a[1].order;
                        }
                        else {
                            return b[1].score - a[1].score;
                        }
                    }
                    if (a[1].score === 10 && b[1].score === 10) {
                        return a[1].order - b[1].order;
                    }
                    else {
                        return a[1].score - b[1].score;
                    }
                });
            }
            else if (sort === "released") {
                entries.sort((a, b) => {
                    if (!sortDirection) {
                        return a[1].released.localeCompare(b[1].released);
                    }
                    return b[1].released.localeCompare(a[1].released);
                });
            }
            else if (sort === "reviewed") {
                entries.sort((a, b) => {
                    if (!sortDirection) {
                        return a[1].reviewed.localeCompare(b[1].reviewed);
                    }
                    return b[1].reviewed.localeCompare(a[1].reviewed);
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
                    row.id = `${key}`;

                    reviewTable.appendChild(row);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
};

function sortAndReloadContent(columnName, element) {
    if (element === null) {
        const selected = document.getElementById(`${columnName}`);
        selected.classList.add('selected-sort');
        sortData(columnName);
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
    sortData(columnName);
}

function getRandomReview() {
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())
        .then(data => {
            let index = Math.trunc(Math.random() * Object.keys(data).length);
            const keys = Object.keys(data);
            window.location.href = `/templates/album-review.html?album=${keys[index]}`;
        });
}

function toReview(element) {
    window.location.href = `/templates/album-review.html?album=${element.id}`;
}

function help() {
    document.getElementById('help').style.display = 'block';
}
function closeHelp() {
    document.getElementById('help').style.display = 'none';
}

function openStats() {
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())
        .then(data => {
            var scores = {
                10: 0,
                9: 0,
                8: 0
            };
            var decades = {};
            for (let key in data) {
                var score = parseInt(data[key]['score']);
                var decade = data[key]['released'].substring(0, 3);
                
                if (score in scores){
                    scores[score]++;
                }
                else{
                    scores['other'] = 1;
                }

                if (decade in decades){
                    decades[decade]++;
                }
                else{
                    decades[decade] = 1;
                }
            }
            document.getElementById('10').innerHTML += scores['10'];
            document.getElementById('9').innerHTML += scores['9'];
            document.getElementById('8').innerHTML += scores['8'];
            document.getElementById('other').innerHTML += scores['other'];

            document.getElementById('20s').innerHTML += decades['202'];
            document.getElementById('10s').innerHTML += decades['201'];
            document.getElementById('00s').innerHTML += decades['200'];
            document.getElementById('90s').innerHTML += decades['199'];
            document.getElementById('80s').innerHTML += decades['198'];
            document.getElementById('70s').innerHTML += decades['197'];
            document.getElementById('60s').innerHTML += decades['196'];

            document.getElementById('stats').style.display = 'block';
        });
}
function closeStats() {
    document.getElementById('stats').style.display = 'none';

    document.getElementById('10').innerHTML = '10: ';
    document.getElementById('9').innerHTML = '9: ';
    document.getElementById('8').innerHTML = '8: ';
    document.getElementById('other').innerHTML = 'other: ';

    document.getElementById('20s').innerHTML = '2020s: ';
    document.getElementById('10s').innerHTML = '2010s: ';
    document.getElementById('00s').innerHTML = '2000s: ';
    document.getElementById('90s').innerHTML = '1990s: ';
    document.getElementById('80s').innerHTML = '1980s: ';
    document.getElementById('70s').innerHTML = '1970s: ';
    document.getElementById('60s').innerHTML = '1960s: ';
}