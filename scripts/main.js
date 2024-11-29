// open and close start menu
document.getElementById('start-button').addEventListener('click', function () {
  const startMenu = document.getElementById('start-menu');
  startMenu.classList.toggle('hidden');
});

document.addEventListener('click', function (event) {
  const startMenu = document.getElementById('start-menu');
  const startButton = document.getElementById('start-button');
  if (!startMenu.contains(event.target) && event.target !== startButton) {
    startMenu.classList.add('hidden');
  }
});
// date/time in bottom right
function updateDateTime() {
  const datetimeElement = document.getElementById("datetime");
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, options).replace(',', '').replace(', ', '<br>');

  datetimeElement.innerHTML = formattedDate;
}
updateDateTime();
setInterval(updateDateTime, 60000);


// add hover event listeners for folder icons
const mediaLibrary = document.getElementById('media-library');
const blogLibrary = document.getElementById('blog-library');
const statsLibrary = document.getElementById('stats-library');
const contentContainer = document.getElementById('folder-content');


// load folder's content on click
async function loadFolderContents(folderName) {
  try {
    const response = await fetch('/resources/files.json');
    const data = await response.json();
    const folderContent = data[folderName];
    contentContainer.innerHTML = '';

    document.getElementById('back-button').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';

    folderContent.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('file-item');

      const title = document.createElement('div');
      const image = document.createElement('img');

      title.textContent = item;
      image.src = `/resources/msft/${folderName}-file.png`;

      itemDiv.appendChild(image);
      itemDiv.appendChild(title);
      itemDiv.style.cursor = "pointer";
      itemDiv.addEventListener('click', () => playMedia(item, folderName));

      contentContainer.appendChild(itemDiv);
      contentContainer.classList.add('file-system')
    });
  } catch (error) {
    console.log('Folder not found ', error);
  }
}
// back button
function goBack() {
  document.getElementById('folder-content').innerHTML = '';
  document.getElementById('back-button').style.display = 'none';
  document.getElementById('main-content').style.display = 'flex';
  document.getElementById('audio-controller').style.display = "none";
  document.getElementById('image-viewer').style.display = "none";
  const videoPlayer = document.getElementById('video-player');
  videoPlayer.style.display = 'none';
  videoPlayer.pause();
}
function handleFolderClick(event) {
  const folderName = event.target.closest('.folder').dataset.folder;
  if (folderName) {
    loadFolderContents(folderName);
  }
}

const imageViewer = document.getElementById('image-viewer');

// document.getElementById('volume').addEventListener('input', function (event) {
//   const audioPlayer = document.getElementById('audio-player');
//   audioPlayer.volume = event.target.value / 10;
// });

// open/close media library
function openMediaPlayer() {
  document.getElementById('media-player').style.display = 'block';
}
function closeMediaPlayer() {
  document.getElementById('media-player').style.display = 'none';
}
function openBlogLibrary() {
  document.getElementById('blog-library').style.display = 'block';
}
function closeBlogLibrary() {
  document.getElementById('blog-library').style.display = 'none';
}
function openStatsLibrary() {
  document.getElementById('stats-library').style.display = 'block';
}
function closeStatsLibrary() {
  document.getElementById('stats-library').style.display = 'none';
}

// drag and drop media library
const blogTitleBar = blogLibrary.querySelector(".title-bar");
const statsTitleBar = statsLibrary.querySelector(".title-bar");
const mediaPlayer = document.getElementById('media-player');
const head = document.getElementById('head');

let isDraggingMedia = false;
let isDraggingBlog = false;
let isDraggingStats = false;

// pick up
head.addEventListener("mousedown", (event) => {
  isDraggingMedia = true;
});
blogTitleBar.addEventListener("mousedown", (event) => {
  isDraggingBlog = true;
});
statsTitleBar.addEventListener("mousedown", (event) => {
  isDraggingStats = true;
});

// drag
document.addEventListener("mousemove", (event) => {
  if (isDraggingMedia) {
    mediaPlayer.style.left = `${event.clientX}px`;
    mediaPlayer.style.top = `${event.clientY + (mediaPlayer.clientHeight / 2) - 5}px`;
  }
  else if (isDraggingBlog) {
    blogLibrary.style.left = `${event.clientX}px`;
    blogLibrary.style.top = `${event.clientY + (blogLibrary.clientHeight / 2) - 5}px`;
  }
  else if (isDraggingStats) {
    statsLibrary.style.left = `${event.clientX}px`;
    statsLibrary.style.top = `${event.clientY + (statsLibrary.clientHeight / 2) - 5}px`;
  }
});

// drop
document.addEventListener("mouseup", () => {
  isDraggingBlog = false;
  isDraggingStats = false;
  isDraggingMedia = false;
});

function shutDown() {
  const body = document.body;
  body.innerHTML = "";
  body.style.background = "black";
  var goodbye = new Audio('/resources/media/goodbye.mp3');
  goodbye.volume = 0.25;
  goodbye.play();
}

function openBlog(div) {
  const date = div.querySelectorAll('td')[1];
  window.location.href = '/blogs/' + date.textContent + '.html';
}
function toggleMusic() {
  if (!audioPlayer.paused) {
    document.getElementById('play-button').innerText = '▶';
    audioPlayer.pause();
    return;
  }
  document.getElementById('play-button').innerText = '⏸';
  audioPlayer.play();
}

// START HEAD JS
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
    if (isRightOpen) {
        rightOpen.src = '/resources/head/R_drwr_close_02_rollover.bmp';
        return;
    }
    rightOpen.src = '/resources/head/R_drwr_open_02_rollover.bmp';
});

rightOpen.addEventListener("mouseleave", (event) => {
    if (isRightOpen) {
        rightOpen.src = '/resources/head/R_drwr_close_01_default.bmp';
        return;
    }
    rightOpen.src = '/resources/head/R_drwr_open_01_default.bmp';
});

rightOpen.addEventListener("mouseup", (event) => {
  console.log(rightEar.style.right);
    isRightOpen = !isRightOpen;
    if (isRightOpen) {
        rightOpen.src = '/resources/head/R_drwr_close_02_rollover.bmp';
        rightEar.style.right = parseInt(rightEar.style.right) - drawerDistance;
        loadFolderContents();
        console.log(rightEar.style.right);
        return;
    }
    rightOpen.src = '/resources/head/R_drwr_open_02_rollover.bmp';
    rightEar.style.right = parseInt(rightEar.style.right) + drawerDistance;
    mediaTable.style.zIndex = -2;
    console.log(rightEar.style.right);

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
// END HEAD JS