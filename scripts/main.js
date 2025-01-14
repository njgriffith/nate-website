// Pre-load and window logic
const smallScreenImage = '/resources/backgrounds/peshay-mobile.png';
var largeScreenImage = '/resources/backgrounds/metropolis.png';

if (window.location.href.includes('netlify')){
  alert('nate-griffith.com is now available!\nGo there for the latest updates')
}

function updateBackgroundImage() {
  const thresholdWidth = 800;
  const icons = document.querySelectorAll('.icon > p');
  if (window.innerWidth <= thresholdWidth) {
    document.body.style.backgroundImage = `url(${smallScreenImage})`;
    icons.forEach(icon => {
      icon.style.background = 'none';
      icon.style.color = 'black';
    });
  } 
  else {
    document.body.style.backgroundImage = `url(${largeScreenImage})`;
    if (largeScreenImage.includes('metropolis')){
      document.body.style.backgroundPosition = '0px 25%';
    }
    else{
      document.body.style.backgroundPosition = '0px 25%';
    }
    
    icons.forEach(icon => {
      icon.style.background = 'rgba(0, 0, 0, 0.6)';
      icon.style.color = 'white';
    });
  }
}
window.addEventListener('resize', updateBackgroundImage);
updateBackgroundImage();

const windows = document.querySelectorAll('.window');
let isAsleep = false;
let previousState = '';

async function getCommits() {
  const url = `https://api.github.com/repos/njgriffith/nate-website/commits`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching commits: ${response.status} ${response.statusText}`);
    }

    const commits = await response.json();
    const commitList = document.createElement('ul');
    commits.slice(0, commits.length).forEach(commit => {
      if (commit.commit.message.length < 10) {
        return;
      }
      const listEntry = document.createElement('li');
      listEntry.style.fontWeight = 'bold';
      commitList.appendChild(listEntry);
      listEntry.innerText = commit.commit.message;
    });

    document.getElementById('changelog-container').appendChild(commitList);

  } catch (error) {
    console.error('Error:', error.message);
  }
}
getCommits();

function randomizeWindows(){
  for(let i=0;i<windows.length;i++){
    if(windows[i].id === 'reviews' || windows[i].id === 'internet'){
      windows[i].style.position = 'absolute';
      windows[i].style.top = `20%`;
      windows[i].style.left = `20%`;
      continue;
    }
    windows[i].style.position = 'absolute';
    windows[i].style.top = `${Math.floor(Math.random() * window.innerHeight * 0.6)}px`;
    windows[i].style.left = `${Math.floor(Math.random() * window.innerWidth * 0.6)}px`;
  }
}
randomizeWindows();

function updateWindowZIndex(frontWindow){
  windows.forEach((window) => {
    window.style.zIndex = '1';
  });
  document.getElementById(frontWindow).style.zIndex = '2';
}

function updateBackground(newBackground){
  largeScreenImage = `/resources/backgrounds/${newBackground}.png`;
  updateBackgroundImage();
}

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
  if (!event.target.classList.contains('icon') && !event.target.parentNode.classList.contains('icon')) {
    const icons = document.querySelectorAll('.icon');
    for (var i = 0; i < icons.length; i++) {
      icons[i].style.outline = 'none';
    }
  }
});

function sleep() {
  isAsleep = true;
  const body = document.body;
  previousState = body.innerHTML;
  body.innerHTML = "";
  body.style.background = "url('/resources/media/pipes.gif')";
  body.style.backgroundPosition = 'center';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backgroundSize = 'cover';
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

  let appName = iconName.toLowerCase().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace('-', ' ');
  let imgSrc = `/resources/msft/${iconName}.png`;

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
    appButton.onclick = function () { maxApp(iconName) };
    taskbarContainer.appendChild(appButton);

    updateWindowZIndex(iconName);
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
const mediaLibrary = document.getElementById('media-player');
const blogLibrary = document.getElementById('blog');
const statsLibrary = document.getElementById('stats');
const musicLibrary = document.getElementById('lists');
const hiddenList = document.getElementById('hidden-list');
const internet = document.getElementById('internet');
const catalog = document.getElementById('catalog');

// open/close libraries
function openApp(appName) {
  if (appName === 'puzzle') {
    window.location.href = '/puzzle/tutorial.html';
    return;
  }
  document.getElementById(appName).style.display = 'block';
  updateTaskbar(appName, 'add');

  if (appName === 'catalog') {
    scrollCatalog(0);
  }
  else if (appName === 'settings'){
    loadFolderContents('background');
  }
}
function closeApp(appName) {
  document.getElementById(appName).style.display = 'none';
  updateTaskbar(appName, 'remove');

  if (appName === 'internet') {
    updateBackgroundImage();
  }
  else if (appName === 'hidden-list') {
    document.getElementById('hidden-list').style.display = 'none';
    document.getElementById('list-container').innerHTML = '';
  }
  else if (appName === 'media-player') {
    document.getElementById('media-player').style.display = 'none';
    audioPlayer.pause();
  }
  else if (appName === 'lists') {
    document.getElementById('lists').style.display = 'none';
    document.getElementById('50-spotify').style.display = 'none';
  }
}
function minApp(appName) {
  document.getElementById(appName).style.display = 'none';
}
function maxApp(appName) {
  const appToMax = document.getElementById(appName);
  appToMax.style.display = 'block';
  appToMax.style.left = '20%';
  appToMax.style.top = '20%';
  updateWindowZIndex(appName);
}

// drag and drop libraries
const titleBars = document.querySelectorAll('.title-bar');
let isDragging = [];
let shift = 0;
for (let i = 0; i < titleBars.length; i++) {
  isDragging.push(false);
}

const mediaPlayer = document.getElementById('media-player');
const head = document.getElementById('head');
let isDraggingMedia = false;

// pick up
head.addEventListener("mousedown", (event) => {
  isDraggingMedia = true;
});

for (let i = 0; i < titleBars.length; i++) {
  titleBars[i].addEventListener("mousedown", (event) => {
    isDragging[i] = true;
    updateWindowZIndex(windows[i].id);
    shift = parseFloat(windows[i].style.left) - event.clientX;
  });
}

// drag
document.addEventListener("mousemove", (event) => {
  if (isDraggingMedia) {
    mediaPlayer.style.left = `${event.clientX - 100}px`;
    mediaPlayer.style.top = `${event.clientY + (mediaPlayer.clientHeight / 2) - 20}px`;
    event.preventDefault();
  }
  for (let i = 0; i < isDragging.length; i++) {
    if (isDragging[i]) {
      windows[i].style.left = `${event.clientX + shift}px`;
      windows[i].style.top = `${event.clientY - 5}px`;
      event.preventDefault();
    }
  }
  if (isAsleep){
    window.location.href = '/';
  }
});

// drop
document.addEventListener("mouseup", () => {
  isDraggingMedia = false;
  for (let i = 0; i < isDragging.length; i++) {
    isDragging[i] = false;
  }
});

function openBlog(div) {
  const date = div.querySelectorAll('td')[1].textContent;
  window.location.href = '/blogs/' + date + '.html';
}

function openList(div) {
  const note = div.querySelectorAll('td')[2].textContent;
  if (note === '50-movies') {
    window.open('https://letterboxd.com/moviefan34/list/top-50/', '_blank').focus();
  }
  else if (note === '50-songs') {
    document.getElementById('50-spotify').style.display = 'block';
    document.getElementById('hidden-list').style.zIndex = '3';
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
    loadFolderContents('music');
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
async function loadFolderContents(type) {
  const response = await fetch('/resources/files.json');
  const data = await response.json();
  const mediaContent = data[type];
  try {
    if (type === 'music'){
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
        itemDiv.addEventListener('click', () => playMedia(item, type));
  
        mediaTableBody.appendChild(itemDiv);
      });
    }
    else if (type === 'background'){
      const settings = document.getElementById('settings').querySelector('.window-body');
      if (settings.innerHTML !== ''){
        return;
      }
      mediaContent.forEach(item => {
        const backgroundDiv = document.createElement('div');
        const backgroundImg = document.createElement('img');
        const backgroundLabel = document.createElement('div');

        backgroundImg.src = `/resources/msft/pictures-file.png`;
        backgroundLabel.innerText = item;

        backgroundDiv.appendChild(backgroundImg);
        backgroundDiv.appendChild(backgroundLabel);
        backgroundDiv.onclick = function () { updateBackground(item) };
        settings.appendChild(backgroundDiv);
      });
    }
  }
  catch (error) {
    console.log('Folder not found ', error);
  }
}

function playMedia(fileName, folderName) {
  if (folderName === "music") {
    const mediaPath = `/resources/music/${fileName}.mp3`;
    audioPlayer.src = mediaPath;
    audioPlayer.play();
    startVisualization();
  }
  else if (folderName === "background") {
    imageViewer.style.display = "block";
    const mediaPath = `/resources/media/${fileName}.jpg`;
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
  listTable.style.width = "100%";
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
    updateWindowZIndex('hidden-list');
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
      if (filePath === 'ebay'){
        startEbay();
      }
    })
    .catch(error => {
      console.error('Error loading HTML:', error);
    });
    
}
function downloadVirus() {
  document.body.style.backgroundImage = "url('/resources/media/virus.gif')";
}
function startEbay(){
  const items = document.querySelectorAll('.ebay-item');
  items.forEach(item => {
      item.addEventListener('mouseup', function (){
        let response = prompt('What would you like to bid?');
        if (response === null || response === ''){
          return;
        }
        let bid = parseFloat(response);
        if (Number(bid) === bid){
          handleBid(item.id, bid);
        }
        else{
          alert("Please enter a valid number");
          return;
        }
      });
  });
}
function handleBid(itemName, bid){
  let shortName = itemName.substring(5);
  if(shortName === 'doll'){
    if (bid > 10){
      alert('Bid accepted');
    }
    else{
      alert('Bid rejected');
    }
  }
  else if(shortName === 'art'){
    if (bid > 199.99){
      alert('Bid accepted');
    }
    else{
      alert('How dare you');
    }
  }
  else if(shortName === 'cars'){
    alert('You know I would\'ve taken anything');
  }
  else if(shortName === 'rock'){
    if (bid > 20000){
      alert('Bid accepted');
    }
    else{
      alert('I have recently become privy to the true power of this device, you will need a higher bid');
    }
  }
  else if(shortName === 'computer'){
    if (bid > 274.99){
      alert('sure');
    }
    else{
      alert('too low');
    }
  }
  else if(shortName === 'dentist'){
    alert('I need these off my hands asap, what your address so I can drop them off');
  }
  else if(shortName === 'soup'){
    if (bid > 9.99){
      alert('enjoy the soup');
    }
    else{
      alert('all out of soup');
    }
  }
  else if(shortName === 'rent'){
    if (confirm('woman?')){
      alert('how soon can you move in?');
    }
    else{
      alert('not interested');
    }
  }
}

function scrollCatalog(direction) {
  const catalogSize = 7;
  const creature = document.getElementById('creature');
  const creatureDesc = document.getElementById('creature-desc');
  var index = parseInt(creature.src.substring(creature.src.length - 7, creature.src.length - 4));
  index += direction;
  var indexString = "";
  if (index > catalogSize) {
    index = 1;
  }
  else if (index < 1) {
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
function highlightApp(div) {
  const icon = div.querySelector('.icon');
  const icons = document.querySelectorAll('.icon');
  for (var i = 0; i < icons.length; i++) {
    icons[i].style.outline = 'none';
  }
  icon.style.outline = '1px dotted blue';
}

function signUp() {
  var email = document.getElementById('signup-email').value;
  alert("this shit don't work rn, come back later");
  return;
  confirm("Sign up using this email?\n" + email);
}

function startVisualization(){
  const consoleDiv = document.getElementById("vid-bkgd");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  consoleDiv.appendChild(canvas);
  canvas.style.position = "absolute";
  canvas.style.top = '0px';
  canvas.style.right = '0px';
  canvas.style.zIndex = '3';
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  canvas.width = consoleDiv.offsetWidth;
  canvas.height = consoleDiv.offsetHeight;

  const characters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  let frameCount = 0;
  const speedFactor = 3;

  function draw() {
    frameCount++;

    if (frameCount % speedFactor !== 0) {
      requestAnimationFrame(draw);
      return;
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, i) => {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;

      ctx.fillText(text, x, y * fontSize);

      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener("resize", () => {
    canvas.width = consoleDiv.offsetWidth;
    canvas.height = consoleDiv.offsetHeight;
  });
}

// Reviews logic
const reviewTable = document.getElementById('review-table');
let sortColumn = 'reviewed';
let sortDirection = true;

window.addEventListener('beforeunload', function () {
    const scrollableDiv = document.getElementById('scroll-div');
    const reviews = document.getElementById('reviews');
    if (scrollableDiv) {
        sessionStorage.setItem('scrollPosition', scrollableDiv.scrollTop);
    }
    sessionStorage.setItem('savedSortColumn', sortColumn);
    sessionStorage.setItem('savedSortDirection', sortDirection);
    sessionStorage.setItem('areReviewsOpen', reviews.style.display);
});

window.addEventListener('load', function () {
    const scrollableDiv = document.getElementById('scroll-div');
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    const savedSortColumn = sessionStorage.getItem('savedSortColumn');
    const savedSortDirection = sessionStorage.getItem('savedSortDirection');
    const reviewDisplay = sessionStorage.getItem('areReviewsOpen');

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
    if (reviewDisplay){
      this.document.getElementById('reviews').style.display = reviewDisplay;
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
                    coverItem.classList.add('review-data');
                    const img = document.createElement('img');
                    img.classList.add('review-img')
                    img.src = `${sortedData[key].cover}`
                    coverItem.appendChild(img);

                    // create title
                    const titleItem = document.createElement('td');
                    titleItem.classList.add('review-data');
                    titleItem.textContent = `${sortedData[key].title}`;

                    // create artist
                    const artistItem = document.createElement('td');
                    artistItem.classList.add('review-data');
                    artistItem.textContent = `${sortedData[key].artist}`;

                    // create score
                    const scoreItem = document.createElement('td');
                    scoreItem.classList.add('review-data');
                    scoreItem.textContent = `${sortedData[key].score}`;

                    // create releaseDate
                    const releaseItem = document.createElement('td');
                    releaseItem.classList.add('review-data');
                    releaseItem.textContent = `${sortedData[key].released}`;

                    // create reviewDate
                    const reviewItem = document.createElement('td');
                    reviewItem.classList.add('review-data');
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

function openReviewStats() {
    fetch('../resources/albums/album_data.json')
        .then(response => response.json())
        .then(data => {
            var scores = {10: 0, 9: 0, 8: 0};
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
            for (let key in scores){
              document.getElementById(key).innerHTML += scores[key];
            }
            for (let key in decades){
              document.getElementById(key + '0s').innerHTML += decades[key];
            }
            document.getElementById('review-stats').style.display = 'block';
            updateWindowZIndex('review-stats');
        });
}
function closeReviewStats() {
    document.getElementById('review-stats').style.display = 'none';
    document.getElementById('review-stats').querySelectorAll('div').forEach(child => {
      if (!child.hasAttribute('id')){
        return;
      }
      child.innerHTML = child.id + ': ';
    });
}

// ----- TEST SUITE -----
// createList('2020s-movies')
// scrollCatalog(6);
// openApp('internet');
// loadHTML('ebay')
