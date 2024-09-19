function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const title = getUrlParameter('album');
const dynamicContentElement = document.getElementById('album-title');
const cover = document.getElementById('album-cover');
console.log(title);


fetch(`/resources/albums/reviews/${title}.txt`)
    .then(response => response.text())
    .then(textData => {
        document.getElementById('review').innerHTML = textData;
        fetch('../resources/albums/album_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(jsonData => {
            document.title = jsonData[`${title}`]['title'];
            cover.src = `/resources/albums/covers/${title}.jpg`;
            dynamicContentElement.textContent = jsonData[`${title}`]['title'];
            if (title === "TVUandN"){
                return;
            }
            document.getElementById('review').innerHTML += '<br>' + jsonData[`${title}`]['score'];
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    })
    .catch(error => console.error('Error loading text file:', error));

