function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const title = getUrlParameter('album');
const dynamicContentElement = document.getElementById('album-title');
const cover = document.getElementById('album-cover');


fetch(`/resources/albums/reviews/${title}.txt`)
    .then(response => response.text())
    .then(data => {
        document.getElementById('review').innerHTML = data;
    })
    .catch(error => console.error('Error loading text file:', error));


fetch('../resources/albums/album_data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        document.title = data[`${title}`]['title'];
        cover.src = `/resources/albums/covers/${title}.jpg`;
        dynamicContentElement.textContent = data[`${title}`]['title'];
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
