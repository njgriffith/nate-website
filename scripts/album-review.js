function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const code = getUrlParameter('album');
const dynamicContentElement = document.getElementById('album-title');
const cover = document.getElementById('album-cover');


try {
    const response = await fetch('https://api.nate-griffith.com/review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
        
    });
    const data = await response.json();
    if (response.ok) {
        handleReviewResponse(data['review'], data['data']);
    }
    else {
        console.error("error processing data");
    }
}
catch (error) {
    console.error("error connecting to backend");
}
function handleReviewResponse(reviewText, jsonData) {
    document.getElementById('review').innerHTML = reviewText;
    const artist = jsonData['artist'];
    document.title = jsonData['title'];
    cover.src = jsonData['cover'];
    dynamicContentElement.textContent = jsonData['title'];
    if (title === "TVUandN") {
        return;
    }
    if (title === "perverts") {
        document.getElementById('review').style.color = '#aaa';
        document.getElementById('review').style.backgroundColor = '#000';
    }
    document.getElementById('review').innerHTML += '<br>' + jsonData['score'];
}
