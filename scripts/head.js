const rightOpen = document.getElementById('right-open');
const rightEar = document.getElementById('right-ear');
const leftOpen = document.getElementById('left-open');
const leftEar = document.getElementById('left-ear');

const mediaTable = document.getElementById('media-table');
const mediaTableBody = document.getElementById('media-table-body');
const audioPlayer = document.getElementById('audio-player');

let isRightOpen = false;
let isLeftOpen = false;
let drawerDistance = 200;

// handle opening right drawer
rightOpen.addEventListener("mouseover", (event) => {
    console.log("test");
    if (isRightOpen) {
        rightOpen.src = '/resources/head/R_drwr_close_02_rollover.bmp';
        return;
    }
    rightOpen.src = '/resources/head/R_drwr_open_02_rollover.bmp';
});

rightOpen.addEventListener("mouseleave", (event) => {
    console.log("test");
    if (isRightOpen) {
        rightOpen.src = '/resources/head/R_drwr_close_01_default.bmp';
        return;
    }
    rightOpen.src = '/resources/head/R_drwr_open_01_default.bmp';
});

rightOpen.addEventListener("mouseup", (event) => {
    console.log("test");
    isRightOpen = !isRightOpen;
    if (isRightOpen) {
        rightOpen.src = '/resources/head/R_drwr_close_02_rollover.bmp';
        rightEar.style.right = parseInt(rightEar.style.right) - drawerDistance;
        loadFolderContents();
        return;
    }
    rightOpen.src = '/resources/head/R_drwr_open_02_rollover.bmp';
    rightEar.style.right = parseInt(rightEar.style.right) + drawerDistance;
    mediaTable.style.zIndex = -2;
});

rightEar.addEventListener('transitionend', function handleTransitionEnd() {
    if (isRightOpen) {
        mediaTable.style.zIndex = 1
        mediaTable.removeEventListener('transitionend', handleTransitionEnd);
        return;
    }
    mediaTable.style.zIndex = -2
    mediaTable.removeEventListener('transitionend', handleTransitionEnd);
});

// handle opening left drawer
leftOpen.addEventListener("mouseover", (event) => {
    if (isLeftOpen) {
        leftOpen.src = '/resources/head/L_drwr_close_02_rollover.bmp';
        return;
    }
    leftOpen.src = '/resources/head/L_drwr_open_02_rollover.bmp';
});

leftOpen.addEventListener("mouseleave", (event) => {
    if (isLeftOpen) {
        leftOpen.src = '/resources/head/L_drwr_close_01_default.bmp';
        return;
    }
    leftOpen.src = '/resources/head/L_drwr_open_01_default.bmp';
});

leftOpen.addEventListener("mouseup", (event) => {
    isLeftOpen = !isLeftOpen;
    if (isLeftOpen) {
        leftOpen.src = '/resources/head/L_drwr_close_02_rollover.bmp';
        leftEar.style.right = parseInt(leftEar.style.right) + drawerDistance;
        return;
    }
    leftOpen.src = '/resources/head/L_drwr_open_02_rollover.bmp';
    leftEar.style.right = parseInt(leftEar.style.right) - drawerDistance;
});

// handle media shit
async function loadFolderContents() {
    try {
        const folderName = 'music';
        const response = await fetch('/resources/files.json');
        const data = await response.json();
        const mediaContent = data[folderName];
        mediaTableBody.innerHTML = '';

        mediaContent.forEach(item => {
            const itemDiv = document.createElement('tr');

            const title = document.createElement('td');
            const length = document.createElement('td');
            const code = document.createElement('td');

            title.textContent = item;
            length.textContent = "1:23";
            code.textContent = item;

            itemDiv.appendChild(title);
            itemDiv.appendChild(length);
            itemDiv.appendChild(code);
            itemDiv.style.cursor = "pointer";
            itemDiv.addEventListener('click', () => playMedia(item, folderName));

            mediaTableBody.appendChild(itemDiv);
        });
    } catch (error) {
        console.log('Folder not found ', error);
    }
}

function playMedia(fileName, folderName) {
    if (folderName === "music") {
        const mediaPath = `/resources/media/${fileName}.mp3`;
        audioPlayer.src = mediaPath;
        audioPlayer.play();
    }
    else if (folderName === "videos") {
        const mediaPath = `/resources/media/${fileName}.mp4`;
        videoPlayer.style.display = 'block';
    }
    else if (folderName === "pictures") {
        imageViewer.style.display = "block";
        const mediaPath = `/resources/media/${fileName}.png`;
        const image = document.createElement('img');
        image.classList.add('library-image')
        image.src = mediaPath;
        imageViewer.innerHTML = "";
        imageViewer.appendChild(image);
    }
    // startVisualization();
}
function startVisualization() {
    const imgElement = document.getElementById('vid-bkgd');

    // Create a new <video> element
    const videoElement = document.createElement('video');
    videoElement.setAttribute('width', '200'); // Same width as the image
    videoElement.setAttribute('controls', 'false'); // Add video controls

    // Add the <source> element for the video
    const sourceElement = document.createElement('source');
    sourceElement.setAttribute('src', '/resources/media/jamiroquai.mp4'); // Path to your video file
    sourceElement.setAttribute('type', 'video/mp4');
    sourceElement.style="position: relative; bottom: 176px; right: 228px; z-index: -1;"
    sourceElement.play;

    // Append the source to the video element
    videoElement.appendChild(sourceElement);

    // Replace the image with the video in the DOM
    imgElement.parentNode.replaceChild(videoElement, imgElement);
}
function closeMediaPlayer(){
    document.getElementById('media-player').style.display = 'none';
}