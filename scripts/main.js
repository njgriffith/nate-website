function updateBackgroundImage() {
  const smallScreenImage = '/resources/media/peshay-mobile.png';
  const largeScreenImage = '/resources/media/peshay.png';
  const thresholdWidth = 800;

  if (window.innerWidth <= thresholdWidth) {
      document.body.style.backgroundImage = `url(${smallScreenImage})`;
  } else {
      document.body.style.backgroundImage = `url(${largeScreenImage})`;
  }
}
window.addEventListener('resize', updateBackgroundImage);
updateBackgroundImage();

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
  if(!event.target.classList.contains('icon') && !event.target.parentNode.classList.contains('icon')){
    const icons = document.querySelectorAll('.icon');
    for(var i=0;i<icons.length;i++){
      icons[i].style.outline='none';
    }
  }
});

// document.addEventListener('contextmenu', (event) => {
//   event.preventDefault();
//   alert('right click');
// });

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
  else if (iconName === 'lists') {
    appName = 'Reviews & Lists';
    imgSrc = '/resources/msft/media.png';
  }
  else if (iconName === 'internet') {
    appName = 'Internet';
    imgSrc = '/resources/msft/internet.png';
  }
  else if (iconName === 'catalog') {
    appName = 'Catalogue';
    imgSrc = '/resources/msft/catalog.png';
  }
  if (action === 'add') {
    const taskBarApps = document.getElementsByClassName('taskbar-button');
    for (let i = 0; i < taskBarApps.length; i++) {
      if (taskBarApps[i].querySelector('p').innerText === appName) {
        return;
      }
    }
    const appImage = document.createElement('img');
    const appButton = document.createElement('button');
    const nameDiv = document.createElement('p');
    appImage.src = imgSrc;
    appImage.classList.add('taskbar-img');
    nameDiv.innerText = appName;
    appButton.classList.add('taskbar-button');
    appButton.appendChild(appImage);
    appButton.appendChild(nameDiv);
    appButton.onclick = function() { maxApp(iconName) };
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
const mediaLibrary = document.getElementById('media');
const blogLibrary = document.getElementById('blog');
const statsLibrary = document.getElementById('stats');
const musicLibrary = document.getElementById('lists');
const hiddenList = document.getElementById('hidden-list');
const internet = document.getElementById('internet');
const catalog = document.getElementById('catalog');

const windows = document.querySelectorAll('.window');
// open/close libraries
function openApp(appName) {
  if(appName === 'reviews'){
    window.location.href = '/templates/reviews.html';
    return;
  }
  else if(appName === 'puzzle'){
    window.location.href = '/puzzle/tutorial.html';
    return;
  }
  document.getElementById(appName).style.display = 'block';
  updateTaskbar(appName, 'add');

  if (appName === 'catalog'){
    scrollCatalog(0);
  }
  
}
function closeApp(appName) {
  document.getElementById(appName).style.display = 'none';
  updateTaskbar(appName, 'remove');

  if (appName === 'internet') {
    document.body.style.backgroundImage = "url('/resources/media/peshay.png')";
  }
  else if (appName === 'hidden-list') {
    document.getElementById('hidden-list').style.display = 'none';
    document.getElementById('list-container').innerHTML = '';
  }
  else if (appName === 'media') {
    document.getElementById('media').style.display = 'none';
    audioPlayer.pause();
  }
  else if (appName === 'lists') {
    document.getElementById('lists').style.display = 'none';
    document.getElementById('50-spotify').style.display = 'none';
  }
}
function minApp(appName){
  document.getElementById(appName).style.display = 'none';
}
function maxApp(appName){
  document.getElementById(appName).style.display = 'block';
}

// drag and drop libraries
const titleBars = document.querySelectorAll('.title-bar');
let isDragging = [];
for(let i=0;i<titleBars.length;i++){
  isDragging.push(false);
}

const mediaPlayer = document.getElementById('media');
const head = document.getElementById('head');
let isDraggingMedia = false;

// pick up
head.addEventListener("mousedown", (event) => {
  isDraggingMedia = true; 
  windows.forEach((window) => {
    window.style.zIndex = '1';
  });
  head.zIndex = 2;
});

for(let i=0;i<titleBars.length;i++){
  titleBars[i].addEventListener("mousedown", (event) => {
    isDragging[i] = true;
    windows.forEach((window) => {
      window.style.zIndex = '1';
    });
    windows[i].style.zIndex = '2';
  });
}

// drag
document.addEventListener("mousemove", (event) => {
  if (isDraggingMedia) {
    mediaPlayer.style.left = `${event.clientX - 100}px`;
    mediaPlayer.style.top = `${event.clientY + (mediaPlayer.clientHeight / 2)}px`;
  }
  for(let i=0;i<isDragging.length;i++){
    if (isDragging[i]){
      windows[i].style.left = `${event.clientX}px`;
      windows[i].style.top = `${event.clientY + (windows[i].clientHeight / 2) - 5}px`;
    }
  }
});

// drop
document.addEventListener("mouseup", () => {
  isDraggingMedia = false;
  for(let i=0;i<isDragging.length;i++){
    isDragging[i] = false;
  }
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
  else {
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

// navigate internet
const url = document.getElementById('url');
url.addEventListener('change', (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === '') {
    return;
  }
  loadHTML(selectedValue.substring(12, selectedValue.length - 4));
});

function loadHTML(filePath) {
  const targetDiv = document.getElementById('internet-screen');
  fetch(`/templates/${filePath}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      targetDiv.innerHTML = html;
    })
    .catch(error => {
      console.error('Error loading HTML:', error);
    });
}
function downloadVirus() {
  document.body.style.backgroundImage = "url('/resources/media/virus.gif')";
}

function scrollCatalog(direction) {
  const catalogSize = 7;
  const creature = document.getElementById('creature');
  const creatureDesc = document.getElementById('creature-desc');
  var index = parseInt(creature.src.substring(creature.src.length - 7, creature.src.length - 4));
  index += direction;
  var indexString = "";
  if (index > catalogSize){
    index = 1;
  }
  else if(index < 1){
    index = catalogSize;
  }

  if (index < 10) {
    indexString = "00" + index.toString();
  }
  else {
    indexString = "0" + index.toString();
  }
  creature.src = `/resources/catalog/${indexString}.gif`;
  fetch(`/resources/catalog/${indexString}.txt`)
    .then(response => response.text())
    .then(textData => {
      creatureDesc.innerHTML = textData;
    })
    .catch(error => console.error('Error loading text file:', error));
}
function highlightApp(div){
  const icon = div.querySelector('.icon');
  const icons = document.querySelectorAll('.icon');
  for(var i=0;i<icons.length;i++){
    icons[i].style.outline='none';
  }
  icon.style.outline = '1px dotted blue';
}
// ----- TEST SUITE -----
// createList('2020s-movies')
// document.getElementById('hidden-list').style.display = 'block';
// loadHTML('notavirus');
// catalog.style.display = 'block';
// scrollCatalog(6);