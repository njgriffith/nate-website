var reviewData = {};
var reviewSortDirection = false;
var currentSort = '';

const reviewTable = document.getElementById('review-table');
const tableHeads = document.querySelectorAll('.review-table-head>tr>th');

async function fetchReviews() {
    try {
        const response = await fetch('https://api.nate-griffith.com/reviews', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        var fetchedData = await response.json();
        reviewData = fetchedData['data'];
        if (response.ok) {
            if (currentSort === '') {
                sortReviewData('reviewed');
            }
            else {
                sortReviewData(currentSort);
            }
        }
        else {
            console.error("error connecting to backend");
        }
    }
    catch (error) {
        console.error("error processing data", error);
    }
}

function sortReviewData(columnName) {
    tableHeads.forEach(head => {
        head.classList.remove('selected-sort');
    });
    document.getElementById(columnName).classList.toggle('selected-sort');
    if (currentSort === columnName) {
        reviewSortDirection = !reviewSortDirection;
    }
    else {
        reviewSortDirection = false;
    }

    currentSort = columnName;
    reviewData = Object.fromEntries(
        Object.entries(reviewData).sort(([, a], [, b]) => {
            if (typeof a[currentSort] === "string" && typeof b[currentSort] === "string") {
                if (reviewSortDirection) {
                    return a[currentSort].localeCompare(b[currentSort]);
                }
                return b[currentSort].localeCompare(a[currentSort]);
            }
            if (reviewSortDirection) {
                if (a[currentSort] === 10 && b[currentSort] === 10){
                    return a['order'] - b['order'];
                }
                return a[currentSort] - b[currentSort];
            }
            if (a[currentSort] === 10 && b[currentSort] === 10){
                return b['order'] - a['order'];
            }
            return b[currentSort] - a[currentSort];
        })
    );
    const divs = reviewTable.querySelectorAll('tbody>tr');
    divs.forEach(div => {
        div.remove();
    });

    for (let key in reviewData) {
        if (reviewData.hasOwnProperty(key)) {
            // create image
            const coverItem = document.createElement('td');
            coverItem.classList.add('review-data');
            const img = document.createElement('img');
            img.classList.add('review-img')
            img.src = `${reviewData[key].cover}`
            coverItem.appendChild(img);

            // create title
            const titleItem = document.createElement('td');
            titleItem.classList.add('review-data');
            titleItem.textContent = `${reviewData[key].title}`;

            // create artist
            const artistItem = document.createElement('td');
            artistItem.classList.add('review-data');
            artistItem.textContent = `${reviewData[key].artist}`;

            // create score
            const scoreItem = document.createElement('td');
            scoreItem.classList.add('review-data');
            scoreItem.textContent = `${reviewData[key].score}`;

            // create releaseDate
            const releaseItem = document.createElement('td');
            releaseItem.classList.add('review-data');
            releaseItem.textContent = `${reviewData[key].released}`;

            // create reviewDate
            const reviewItem = document.createElement('td');
            reviewItem.classList.add('review-data');
            reviewItem.textContent = `${reviewData[key].reviewed}`;

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
};

function getRandomReview() {
    let index = Math.trunc(Math.random() * Object.keys(reviewData).length);
    const keys = Object.keys(reviewData);
    window.location.href = `/templates/album-review.html?album=${keys[index]}`;
}

function toReview(element) {
    window.location.href = `/templates/album-review.html?album=${element.id}`;
}

function openReviewStats() {
    var scores = { 10: 0, 9: 0, 8: 0 };
    var decades = {};
    for (let key in reviewData) {
        var score = parseInt(reviewData[key]['score']);
        var decade = reviewData[key]['released'].substring(0, 3);

        if (score in scores) {
            scores[score]++;
        }
        else {
            scores['other'] = 1;
        }

        if (decade in decades) {
            decades[decade]++;
        }
        else {
            decades[decade] = 1;
        }
    }
    for (let key in scores) {
        document.getElementById(key).innerHTML += scores[key];
    }
    for (let key in decades) {
        document.getElementById(key + '0s').innerHTML += decades[key];
    }
    document.getElementById('review-stats').style.display = 'block';
    updateWindowZIndex('review-stats');
}
function closeReviewStats() {
    document.getElementById('review-stats').style.display = 'none';
    document.getElementById('review-stats').querySelectorAll('div').forEach(child => {
        if (!child.hasAttribute('id')) {
            return;
        }
        child.innerHTML = child.id + ': ';
    });
}

const scrollableDiv = document.getElementById('scroll-div');
const savedScrollPosition = sessionStorage.getItem('scrollPosition');
const savedSortColumn = sessionStorage.getItem('savedSortColumn');
const savedSortDirection = sessionStorage.getItem('savedSortDirection');
const savedReviewData = sessionStorage.getItem('savedReviewData');

window.addEventListener('load', function () {
    if (scrollableDiv && savedScrollPosition) {
        setTimeout(() => {
            scrollableDiv.scrollTop = parseInt(savedScrollPosition);
        }, 100);
    }
    if (savedSortColumn) {
        reviewSortDirection = savedSortDirection;
        currentSort = '';
        try {
            reviewData = savedReviewData ? JSON.parse(savedReviewData) : [];
        } 
        catch (error) {
            console.error("Error parsing saved review data:", error);
            reviewData = [];
        }
        sortReviewData(savedSortColumn);
    }
    else{
        fetchReviews();
    }
});

window.addEventListener('beforeunload', function () {
    const scrollableDiv = document.getElementById('scroll-div');
    if (scrollableDiv) {
        sessionStorage.setItem('scrollPosition', scrollableDiv.scrollTop);
    }
    sessionStorage.setItem('savedSortColumn', currentSort);
    sessionStorage.setItem('savedSortDirection', reviewSortDirection);
    sessionStorage.setItem('savedReviewData', JSON.stringify(reviewData));
});