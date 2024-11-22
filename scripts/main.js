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
const folderImages = mediaLibrary.querySelectorAll('.folder-img');
const contentContainer = document.getElementById('folder-content');

folderImages.forEach(img => {
  const originalSrc = img.src;
  const hoverSrc = '/resources/msft/folder-open.png';

  img.addEventListener('mouseenter', function () {
    img.src = hoverSrc;
  });

  img.addEventListener('mouseleave', function () {
    img.src = originalSrc;
  });
});

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

document.getElementById('music-folder').addEventListener('click', handleFolderClick);
document.getElementById('videos-folder').addEventListener('click', handleFolderClick);
document.getElementById('pictures-folder').addEventListener('click', handleFolderClick);

const imageViewer = document.getElementById('image-viewer');
// play selected media
function playMedia(fileName, folderName) {
  const audioPlayer = document.getElementById('audio-player');
  const videoPlayer = document.getElementById('video-player');
  const controller = document.getElementById('audio-controller');

  if (folderName === "music"){
    const mediaPath = `/resources/media/${fileName}.mp3`;
    audioPlayer.src = mediaPath;
    controller.style.display = 'block';
    audioPlayer.play();
  }
  else if (folderName === "videos"){
    const mediaPath = `/resources/media/${fileName}.mp4`;
    videoPlayer.style.display = 'block';
  }
  else if (folderName === "pictures"){
    imageViewer.style.display = "block";
    const mediaPath = `/resources/media/${fileName}.png`;
    const image = document.createElement('img');
    image.classList.add('library-image')
    image.src = mediaPath;
    imageViewer.innerHTML = "";
    imageViewer.appendChild(image);
  }
}

document.getElementById('volume').addEventListener('input', function (event) {
  const audioPlayer = document.getElementById('audio-player');
  audioPlayer.volume = event.target.value / 10;
});

// open/close media library
function openMediaLibrary(){
  document.getElementById('media-library').style.display = 'block';
}

function closeMediaLibrary(){
  document.getElementById('media-library').style.display = 'none';
}

// drag and drop media library
const titleBar = mediaLibrary.querySelector(".title-bar");
let isDragging = false;

// pick up
titleBar.addEventListener("mousedown", (event) => {
    isDragging = true;
});

// drag
document.addEventListener("mousemove", (event) => {
  // console.log(event.clientX, event.clientY);
    if (isDragging) {
        mediaLibrary.style.left = `${event.clientX}px`;
        mediaLibrary.style.top = `${event.clientY + (mediaLibrary.clientHeight/2) - 5}px`;
    }
});

// drop
document.addEventListener("mouseup", () => {
    isDragging = false;
});

function shutDown(){
  const body = document.body;
  body.innerHTML = "";
  body.style.background = "black";
  var goodbye = new Audio('/resources/media/goodbye.mp3');
  goodbye.volume = 0.25;
  goodbye.play();
}
