// START TASKBAR LOGIC
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

function shutDown() {
  const body = document.body;
  body.innerHTML = "";
  body.style.background = "black";
  var goodbye = new Audio('/resources/media/goodbye.mp3');
  goodbye.volume = 0.25;
  goodbye.play();
}

// date/time in bottom right
function updateDateTime() {
  const datetimeElement = document.getElementById("datetime");
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, options).replace(',', '').replace(', ', '<br>');

  datetimeElement.innerHTML = formattedDate;
}

function updateTaskbar(iconName, action) {
  const taskbarContainer = document.getElementById('taskbar-apps');
  let appName = '';
  let imgSrc = '';
  if (iconName === 'media') {
    appName = 'Media Player';
    imgSrc = '/resources/msft/music.png';
  }
  else if (iconName === 'blog') {
    appName = 'Blogs';
    imgSrc = '/resources/msft/blog-table.png';
  }
  else if (iconName === 'stats') {
    appName = 'Stats';
    imgSrc = '/resources/msft/cubes.png';
  }
  else if (iconName === 'music') {
    appName = 'Reviews & Lists';
    imgSrc = '/resources/msft/media.png';
  }
  if (action === 'add') {
    const appImage = document.createElement('img');
    const appButton = document.createElement('button');
    const nameDiv = document.createElement('p');
    appImage.src = imgSrc;
    appImage.classList.add('taskbar-img');
    nameDiv.innerText = appName;
    appButton.classList.add('taskbar-button');
    appButton.appendChild(appImage);
    appButton.appendChild(nameDiv);
    taskbarContainer.appendChild(appButton);
  }
  else if (action === 'remove') {
    const taskBarApps = document.getElementsByClassName('taskbar-button');
    for (let i = 0; i < taskBarApps.length; i++) {
      if (taskBarApps[i].querySelector('p').innerText === appName) {
        taskBarApps[i].remove();
        return;
      }
    }
  }
}
updateDateTime();
setInterval(updateDateTime, 60000);
// END  TASKBAR LOGIC

// ICON LOGIC START
const mediaLibrary = document.getElementById('media-library');
const blogLibrary = document.getElementById('blog-library');
const statsLibrary = document.getElementById('stats-library');
const musicLibrary = document.getElementById('music-library');
const hiddenList = document.getElementById('hidden-list');

// open/close libraries
function openMediaPlayer() {
  document.getElementById('media-player').style.display = 'block';
  updateTaskbar('media', 'add');
}
function closeMediaPlayer() {
  document.getElementById('media-player').style.display = 'none';
  updateTaskbar('media', 'remove');
  audioPlayer.pause();
}
function openBlogLibrary() {
  document.getElementById('blog-library').style.display = 'block';
  updateTaskbar('blog', 'add');
}
function closeBlogLibrary() {
  document.getElementById('blog-library').style.display = 'none';
  updateTaskbar('blog', 'remove');
}
function openStatsLibrary() {
  document.getElementById('stats-library').style.display = 'block';
  updateTaskbar('stats', 'add');
}
function closeStatsLibrary() {
  document.getElementById('stats-library').style.display = 'none';
  updateTaskbar('stats', 'remove');
}
function openMusicLibrary() {
  document.getElementById('music-library').style.display = 'block';
  updateTaskbar('music', 'add');
}
function closeMusicLibrary() {
  document.getElementById('music-library').style.display = 'none';
  updateTaskbar('music', 'remove');
  document.getElementById('50-spotify').style.display = 'none';
}
function closeHiddenList() {
  document.getElementById('hidden-list').style.display = 'none';
  document.getElementById('list-container').innerHTML = '';
}

// drag and drop libraries
const blogTitleBar = blogLibrary.querySelector(".title-bar");
const statsTitleBar = statsLibrary.querySelector(".title-bar");
const musicTitleBar = musicLibrary.querySelector(".title-bar");
const listTitleBar = hiddenList.querySelector(".title-bar");
const mediaPlayer = document.getElementById('media-player');
const head = document.getElementById('head');

let isDraggingMedia = false;
let isDraggingBlog = false;
let isDraggingStats = false;
let isDraggingMusic = false;
let isDraggingList = false;

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
musicTitleBar.addEventListener("mousedown", (event) => {
  isDraggingMusic = true;
});
listTitleBar.addEventListener("mousedown", (event) => {
  isDraggingList = true;
});

// drag
document.addEventListener("mousemove", (event) => {
  if (isDraggingMedia) {
    mediaPlayer.style.left = `${event.clientX - 100}px`;
    mediaPlayer.style.top = `${event.clientY + (mediaPlayer.clientHeight / 2)}px`;
  }
  else if (isDraggingBlog) {
    blogLibrary.style.left = `${event.clientX}px`;
    blogLibrary.style.top = `${event.clientY + (blogLibrary.clientHeight / 2) - 5}px`;
  }
  else if (isDraggingStats) {
    statsLibrary.style.left = `${event.clientX}px`;
    statsLibrary.style.top = `${event.clientY + (statsLibrary.clientHeight / 2) - 5}px`;
  }
  else if (isDraggingMusic) {
    musicLibrary.style.left = `${event.clientX}px`;
    musicLibrary.style.top = `${event.clientY + (musicLibrary.clientHeight / 2) - 5}px`;
  }
  else if (isDraggingList) {
    hiddenList.style.left = `${event.clientX}px`;
    hiddenList.style.top = `${event.clientY + (hiddenList.clientHeight / 2) - 5}px`;
  }
});

// drop
document.addEventListener("mouseup", () => {
  isDraggingBlog = false;
  isDraggingStats = false;
  isDraggingMedia = false;
  isDraggingMusic = false;
  isDraggingList = false;
});

function openBlog(div) {
  const date = div.querySelectorAll('td')[1].textContent;
  window.location.href = '/blogs/' + date + '.html';
}

function openList(div) {
  const note = div.querySelectorAll('td')[2].textContent;
  if (note === 'reviews') {
    window.location.href = '/templates/' + note + '.html';
  }
  else if (note === '50-movies') {
    window.open('https://letterboxd.com/moviefan34/list/top-50/', '_blank').focus();
  }
  else if (note === '50-songs') {
    document.getElementById('50-spotify').style.display = 'block';
  }
  else{
    createList(note);
    document.getElementById('hidden-list').querySelector('.title-bar-text').innerHTML = div.querySelectorAll('td')[0].textContent;
    document.getElementById('hidden-list').style.display = 'block';
  }
}
// ICON LOGIC END

// START HEAD LOGIC
const rightOpen = document.getElementById('right-open');
const rightEar = document.getElementById('right-ear');
const leftOpen = document.getElementById('left-open');
const leftEar = document.getElementById('left-ear');

const mediaTable = document.getElementById('media-table');
const mediaTableBody = document.getElementById('media-table-body');
const audioPlayer = document.getElementById('audio-player');

const knobDrawer = document.getElementById('knob-drawer');

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
  isRightOpen = !isRightOpen;
  if (isRightOpen) {
    rightOpen.src = '/resources/head/R_drwr_close_02_rollover.bmp';
    rightEar.style.left = `${parseInt(rightEar.style.left) + drawerDistance}px`;
    loadFolderContents();
    return;
  }
  rightOpen.src = '/resources/head/R_drwr_open_02_rollover.bmp';
  rightEar.style.left = `${parseInt(rightEar.style.left) - drawerDistance}px`;
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
    leftEar.style.left = `${parseInt(leftEar.style.left) - drawerDistance}px`;
    return;
  }
  leftOpen.src = '/resources/head/L_drwr_open_02_rollover.bmp';
  leftEar.style.left = `${parseInt(leftEar.style.left) + drawerDistance}px`;
});

leftEar.addEventListener('transitionend', function handleTransitionEnd() {
  if (isLeftOpen) {
    knobDrawer.style.zIndex = 1
    knobDrawer.removeEventListener('transitionend', handleTransitionEnd);
    return;
  }
  knobDrawer.style.zIndex = -2
  knobDrawer.removeEventListener('transitionend', handleTransitionEnd);
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
  sourceElement.style = "position: relative; bottom: 176px; right: 228px; z-index: -1;"
  sourceElement.play;

  // Append the source to the video element
  videoElement.appendChild(sourceElement);

  // Replace the image with the video in the DOM
  imgElement.parentNode.replaceChild(videoElement, imgElement);
}
// END HEAD LOGIC

function createList(fileName) {
  const listContainer = document.getElementById('list-container');
  listContainer.innerHTML = '';
  listContainer.style.marginTop = '5em';
  const listTable = document.createElement('table');
  listContainer.appendChild(listTable);
  fetch(`../resources/lists/${fileName}.json`)
    .then(response => response.json())
    .then(data => {
      const tableHead = document.createElement('thead');
      const tableBody = document.createElement('tbody');
      listTable.appendChild(tableHead);
      listTable.appendChild(tableBody);
      data.forEach((item, index) => {
        if (index === 0) {
          const headerRow = document.createElement('tr');
          const rankTitle = document.createElement('th');
          rankTitle.innerHTML = 'Rank';
          headerRow.appendChild(rankTitle);
          for (let i = 0; i < Object.keys(item).length; i++) {
            const colTitle = document.createElement('th');
            colTitle.innerHTML = Object.keys(item)[i].toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // why tf does js not have toTitleCase???
            headerRow.appendChild(colTitle);
          }
          tableHead.appendChild(headerRow);
        }
        const row = document.createElement('tr');
        row.classList.add('blog-row');
        const rankIndex = document.createElement('td');
        rankIndex.innerHTML = index + 1;
        row.appendChild(rankIndex);
        for (let i = 0; i < Object.keys(item).length; i++) {
          const tableData = document.createElement('td');
          tableData.innerHTML = Object.values(item)[i];
          row.appendChild(tableData);
        }
        tableBody.appendChild(row);
      });
    })
}
// createList('2020s-albums')
// document.getElementById('hidden-list').style.display = 'block';
