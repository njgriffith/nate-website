// Pre-load and window logic
const smallScreenImage = '/resources/backgrounds/peshay-mobile.png';
var largeScreenImage = '/resources/backgrounds/metropolis.png';

var backgroundList = [];
var songList = [];
var currentSongIndex = 0;
var windowStack = [];
var weatherData = {};
const weatherCodes = {
  "0": "Unknown",
  "1000": "Clear",
  "1100": "Mostly Clear",
  "1101": "Partly Cloudy",
  "1102": "Mostly Cloudy",
  "1001": "Cloudy",
  "2000": "Fog",
  "2100": "Light Fog",
  "4000": "Drizzle",
  "4200": "Light Rain",
  "4001": "Rain",
  "4201": "Heavy Rain",
  "5000": "Snow",
  "5001": "Flurries",
  "5100": "Light Snow",
  "5101": "Heavy Snow",
  "6000": "Freezing Drizzle",
  "6001": "Freezing Rain",
  "6200": "Light Freezing Rain",
  "6201": "Heavy Freezing Rain",
  "7000": "Ice Pellets",
  "7101": "Heavy Ice Pellets",
  "7102": "Light Ice Pellets",
  "8000": "Thunderstorm"
}
weatherData = {
  "cloudBase": 0.9,
  "cloudCeiling": 0.9,
  "cloudCover": 100,
  "dewPoint": 30.8,
  "freezingRainIntensity": 0,
  "hailProbability": 9.7,
  "hailSize": 1.19,
  "humidity": 46,
  "precipitationProbability": 0,
  "pressureSurfaceLevel": 29.8,
  "rainIntensity": 0,
  "sleetIntensity": 0,
  "snowIntensity": 0,
  "temperature": 50.9,
  "temperatureApparent": 50.9,
  "uvHealthConcern": 0,
  "uvIndex": 0,
  "visibility": 9.94,
  "weatherCode": 1001,
  "windDirection": 170,
  "windGust": 14.3,
  "windSpeed": 5.9,
  "location": [
    "Durham, Durham County, North Carolina, 27703, United States"
  ]
}

// element variables
const iconLabels = document.querySelectorAll('.icon > p');
const icons = document.querySelectorAll('.icon');
const windows = document.querySelectorAll('.window');

let isAsleep = false;
let previousState = '';

var isHighlighting = false;
var rightClickStartX = 0;
var rightClickStartY = 0;
const rightClickBox = document.getElementById('right-click-box');

const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');

const taskBarApps = document.getElementsByClassName('taskbar-button');

const mediaLibrary = document.getElementById('media-player');
const blogLibrary = document.getElementById('blog');
const statsLibrary = document.getElementById('stats');
const musicLibrary = document.getElementById('lists');
const hiddenList = document.getElementById('hidden-list');
const internet = document.getElementById('internet');
const catalog = document.getElementById('catalog');

const recycleBody = document.getElementById('recycle-body');

fetch(`../resources/files.json`)
  .then(response => response.json())
  .then(data => {
    backgroundList = data['background'];
    songList = data['music'];

    // let index = Math.floor(Math.random() * backgroundList.length);
    // largeScreenImage = `/resources/backgrounds/${backgroundList[index]}.png`;
    updateBackgroundImage();
  });

async function getWeather() {
  try {
    const response = await fetch('https://api.nate-griffith.com/weather', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    if (response.ok) {
      let keys = Object.keys(data['data']['values']);
      let values = Object.values(data['data']['values']);
      for (let i = 0; i < keys.length; i++) {
        weatherData[keys[i]] = values[i];
      }
      weatherData['location'] = [data['location']['name']];
      handleWeatherResponse();
    }
    else {
      alert('error fetching weather');
    }
  }
  catch (error) {
    alert('error connecting to service');
    console.error(error);
  }
}
handleWeatherResponse();
function handleWeatherResponse() {
  document.getElementById('temperature').innerText = `${weatherData['temperature']} \u00B0F`;
  document.getElementById('weather-label').innerText = `${weatherCodes[weatherData['weatherCode']]}`;
  document.getElementById('wind-speed').innerText = `Wind: ${handleWindDirection(weatherData['windDirection'])} ${weatherData['windSpeed']} mph`;
  document.getElementById('wind-gust').innerText = `Gusts up to ${weatherData['windGust']} mph`;

  var weatherLocation = weatherData['location'][0].split(', ');
  document.getElementById('location').querySelectorAll('div')[1].innerText = weatherLocation[0];
  document.getElementById('humidity').querySelectorAll('div')[1].innerText = `${weatherData['humidity']}%`;
  document.getElementById('dewpoint').querySelectorAll('div')[1].innerText = `${weatherData['dewPoint']} \u00B0F`;
  document.getElementById('pressure-surface-level').querySelectorAll('div')[1].innerText = `${weatherData['pressureSurfaceLevel']} inHg`;
  document.getElementById('visibility').querySelectorAll('div')[1].innerText = `${weatherData['visibility']} miles`;
  document.getElementById('uv-index').querySelectorAll('div')[1].innerText = `${weatherData['uvIndex']}`;
  handleWeatherIcon();
}

function handleWindDirection(directionString) {
  var direction = parseInt(directionString);
  var windDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const increment = 22.5;
  var start = 348.75;
  for (let i = 0; i < 16; i++) {
    if (start < direction && direction < (start + increment % 360)) {
      return windDirections[i];
    }
    start = (start + increment) % 360;
  }
  return 'N';
}

function handleWeatherIcon() {
  var iconName = weatherCodes[weatherData['weatherCode']];
  const isNight = (new Date().toTimeString().substring(0, 2) - 12) > 6;
  const codesForNight = [1000, 1100, 1101, 1102];
  if (isNight && codesForNight.includes(weatherData['weatherCode'])) {
    iconName += ' Night';
  }
  document.getElementById('weather-img').src = `/resources/weather/${iconName}.png`;
}


if (window.location.href.includes('netlify')) {
  alert('nate-griffith.com is now available!\nGo there for the latest updates')
}
else if (window.location.href.includes('nate-griffith.com')) {
  getWeather();
  getCommits();
  openApp('weather');
}

function updateBackgroundImage() {
  const thresholdWidth = 800;
  if (window.innerWidth <= thresholdWidth) {
    document.body.style.backgroundImage = `url(${smallScreenImage})`;
    iconLabels.forEach(icon => {
      icon.style.background = 'none';
      icon.style.color = 'black';
    });
  }
  else {
    document.body.style.backgroundImage = `url(${largeScreenImage})`;
    document.body.style.backgroundPosition = '0px 25%';
    iconLabels.forEach(icon => {
      icon.style.background = 'rgba(0, 0, 0, 0.6)';
      icon.style.color = 'white';
    });
  }
}
window.addEventListener('resize', updateBackgroundImage);



async function getCommits() {
  const url = `https://api.nate-griffith.com/commits`;
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
      listEntry.innerText = commit.commit.author['date'].substring(5, 10) + ": " + commit.commit.message;
    });

    document.getElementById('changelog-container').appendChild(commitList);

  } catch (error) {
    console.error('Error:', error.message);
  }
}


function randomizeWindows() {
  for (let i = 0; i < windows.length; i++) {
    if (windows[i].id === 'reviews' || windows[i].id === 'internet' || windows[i].id === 'minesweeper') {
      windows[i].style.position = 'absolute';
      windows[i].style.top = `100px`;
      windows[i].style.left = `100px`;
      continue;
    }
    else if (windows[i].id === 'weather') {
      windows[i].style.position = 'absolute';
      windows[i].style.top = `100px`;
      windows[i].style.left = `${window.innerWidth - 600}px`;
      continue;
    }
    else if (windows[i].id === 'changelog') {
      windows[i].style.position = 'absolute';
      windows[i].style.bottom = `200px`;
      windows[i].style.left = `400px`;
      continue;
    }
    windows[i].style.position = 'absolute';
    windows[i].style.top = `${Math.floor(Math.random() * window.innerHeight * 0.6)}px`;
    windows[i].style.left = `${Math.floor(Math.random() * window.innerWidth * 0.6)}px`;
  }
}
randomizeWindows();

var focusedWindow = '';
function updateWindowZIndex(frontWindow) {
  if (frontWindow === null) {
    return;
  }
  focusedWindow = frontWindow;
  if (!windowStack.includes(document.getElementById(frontWindow))) {
    windowStack.unshift(document.getElementById(frontWindow));
  }
  else {
    var indexToRemove = windowStack.indexOf(document.getElementById(frontWindow));
    windowStack.splice(indexToRemove, 1);
    windowStack.unshift(document.getElementById(frontWindow));
  }
  windowStack.forEach((wind, index) => {
    wind.style.zIndex = windowStack.length - index;
  });
  document.querySelector('.taskbar').style.zIndex = windowStack.length + 1;
}

function updateBackground(newBackground) {
  largeScreenImage = `/resources/backgrounds/${newBackground}.png`;
  updateBackgroundImage();
}

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

document.addEventListener('mousedown', (event) => {
  if (!startMenu.contains(event.target) && event.target !== startButton) {
    startMenu.classList.add('hidden');
  }
  if (!event.target.classList.contains('icon') && !event.target.parentNode.classList.contains('icon')) {
    for (var i = 0; i < icons.length; i++) {
      icons[i].style.outline = 'none';
      icons[i].classList.remove('highlighted-icon');
    }
  }
  isHighlighting = true;
  rightClickStartX = event.clientX;
  rightClickStartY = event.clientY;
  rightClickBox.style.left = `${event.clientX}px`;
  rightClickBox.style.top = `${event.clientY}px`;
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Delete') {
    var appsToDelete = document.querySelectorAll('.highlighted-icon');
    appsToDelete.forEach(appToDelete => {
      recycleApp(appToDelete);
    });
    icons.forEach(icon => {
      if (icon.style.outline === 'none') {
        return;
      }
      recycleApp(icon);
    });
  }
});

function recycleApp(appToDelete) {
  const tempName = appToDelete.querySelector('p').innerText;
  if (tempName === 'Recycle') {
    return;
  }
  appToDelete.style.display = 'none';
  const tempRow = document.createElement('tr');
  const deletedName = document.createElement('td');
  const deletedTime = document.createElement('td');
  deletedName.innerText = tempName;
  deletedTime.innerText = new Date().toLocaleString();

  tempRow.onclick = function () { recoverApp(tempName) };
  tempRow.id = `recycle-row-${tempName.trim()}`
  tempRow.appendChild(deletedName);
  tempRow.appendChild(deletedTime);
  recycleBody.appendChild(tempRow);
}

function recoverApp(deletedName) {
  icons.forEach(icon => {
    if (icon.querySelector('p').innerText === deletedName) {
      icon.style.display = 'block';
      document.getElementById(`recycle-row-${deletedName.trim()}`).remove();
    }
  });
}

// START TASKBAR LOGIC
document.getElementById('start-button').addEventListener('click', function () {
  startMenu.classList.toggle('hidden');
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
  else if (appName === 'settings') {
    loadFolderContents('background');
  }
}
function closeApp(appName) {
  document.getElementById(appName).style.display = 'none';
  updateTaskbar(appName, 'remove');
  windowStack.splice(windowStack.indexOf(document.getElementById(appName)), 1);
  // windowStack.remove(document.getElementById(appName));

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
  else if (appName === 'leaderboard') {
    document.getElementById('leaderboard-container').querySelectorAll('div>ol>li').forEach(leaderboardEntry => {
      leaderboardEntry.remove();
    });
  }
}
function minApp(appName) {
  document.getElementById(appName).style.display = 'none';
}
function maxApp(appName) {
  const appToMax = document.getElementById(appName);
  appToMax.style.display = 'block';
  appToMax.style.left = '200px';
  appToMax.style.top = '200px';
  updateWindowZIndex(appName);
}

// drag and drop libraries
const titleBars = document.querySelectorAll('.title-bar');
const playerCurrentTime = document.getElementById('player-current-time');
const mediaPlayer = document.getElementById('media-player');
const head = document.getElementById('head');

let isDragging = [];
let shift = 0;
let mediaPlayerShiftX = 0;
let mediaPlayerShiftY = 0;

let timeShift = 0;
var timeElapsed = 0;

for (let i = 0; i < titleBars.length; i++) {
  isDragging.push(false);
}

var isDraggingMedia = false;
var isDraggingMediaTime = false;
// pick up
head.addEventListener("mousedown", (event) => {
  updateWindowZIndex('media-player');
  isDraggingMedia = true;
  mediaPlayerShiftX = parseFloat(mediaPlayer.style.left) - event.clientX;
  mediaPlayerShiftY = parseFloat(mediaPlayer.style.top) - event.clientY;
});

playerCurrentTime.addEventListener("mousedown", (event) => {
  isDraggingMediaTime = true;
  timeShift = parseFloat(playerCurrentTime.style.left) - event.clientX;
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
  if (isAsleep) {
    window.location.href = '/';
    return;
  }
  if (event.clientY < 0 || event.clientX < 0 || event.clientX > window.innerWidth) {
    return;
  }
  event.preventDefault();
  if (isDraggingMedia) {
    isHighlighting = false;
    mediaPlayer.style.left = `${event.clientX + mediaPlayerShiftX}px`;
    mediaPlayer.style.top = `${event.clientY + mediaPlayerShiftY}px`;
  }
  for (let i = 0; i < isDragging.length; i++) {
    if (isDragging[i]) {
      isHighlighting = false;
      windows[i].style.left = `${event.clientX + shift}px`;
      windows[i].style.top = `${event.clientY - 5}px`;
    }
  }
  if (isDraggingMediaTime) {
    isHighlighting = false;
    if (event.clientX + timeShift < 0) {
      return;
    }
    else if (event.clientX + timeShift > 160) {
      return;
    }
    playerCurrentTime.style.left = `${event.clientX + timeShift}px`;
  }
  if (isHighlighting) {
    let currentX = event.clientX;
    let currentY = event.clientY;
    let width = Math.abs(event.clientX - rightClickStartX);
    let height = Math.abs(event.clientY - rightClickStartY);

    rightClickBox.style.width = `${width}px`;
    rightClickBox.style.height = `${height}px`;

    rightClickBox.style.left = currentX < rightClickStartX ? `${currentX}px` : `${rightClickStartX}px`;
    rightClickBox.style.top = currentY < rightClickStartY ? `${currentY}px` : `${rightClickStartY}px`;
    icons.forEach(icon => {
      var iconLeft = icon.getBoundingClientRect().left + 40;
      var iconTop = icon.getBoundingClientRect().top + 40;
      if ((Math.min(currentX, rightClickStartX) <= iconLeft && iconLeft <= Math.max(currentX, rightClickStartX)) && (Math.min(currentY, rightClickStartY) <= iconTop && iconTop <= Math.max(currentY, rightClickStartY))) {
        icon.classList.add('highlighted-icon');
      }
      else {
        icon.classList.remove('highlighted-icon');
      }
    });
  }
});

// drop
document.addEventListener("mouseup", (event) => {
  if (audioPlayer.duration && isDraggingMediaTime) {
    audioPlayer.currentTime = (parseFloat(playerCurrentTime.style.left) / 160) * audioPlayer.duration;
  }
  isDraggingMedia = false;
  isDraggingMediaTime = false;
  for (let i = 0; i < isDragging.length; i++) {
    isDragging[i] = false;
  }
  isHighlighting = false;
  rightClickBox.style.width = '0px';
  rightClickBox.style.height = '0px';
  rightClickBox.style.outline = 'none';
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
const internetUrl = document.getElementById('url');
internetUrl.addEventListener('change', (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === '') {
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '700px';
    tempDiv.style.height = '475px';
    tempDiv.style.backgroundImage = "url('/resources/media/backrooms.gif')";
    tempDiv.style.backgroundSize = 'cover';
    tempDiv.style.margin = '3em';
    document.getElementById('internet-screen').innerHTML = '';
    document.getElementById('internet-screen').appendChild(tempDiv);
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
      if (filePath === 'ebay') {
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
function startEbay() {
  const items = document.querySelectorAll('.ebay-item');
  items.forEach(item => {
    item.addEventListener('mouseup', function () {
      let response = prompt('What would you like to bid?');
      if (response === null || response === '') {
        return;
      }
      let bid = parseFloat(response);
      if (Number(bid) === bid) {
        handleBid(item.id, bid);
      }
      else {
        alert("Please enter a valid number");
        return;
      }
    });
  });
}
function handleBid(itemName, bid) {
  let shortName = itemName.substring(5);
  if (shortName === 'doll') {
    if (bid > 10) {
      alert('Bid accepted');
    }
    else {
      alert('Bid rejected');
    }
  }
  else if (shortName === 'art') {
    if (bid > 199.99) {
      alert('Bid accepted');
    }
    else {
      alert('How dare you');
    }
  }
  else if (shortName === 'cars') {
    alert('You know I would\'ve taken anything');
  }
  else if (shortName === 'rock') {
    if (bid > 20000) {
      alert('Bid accepted');
    }
    else {
      alert('I have recently become privy to the true power of this device, you will need a higher bid');
    }
  }
  else if (shortName === 'computer') {
    if (bid > 274.99) {
      alert('sure');
    }
    else {
      alert('too low');
    }
  }
  else if (shortName === 'dentist') {
    alert('I need these off my hands asap, what your address so I can drop them off');
  }
  else if (shortName === 'soup') {
    if (bid > 9.99) {
      alert('enjoy the soup');
    }
    else {
      alert('all out of soup');
    }
  }
  else if (shortName === 'rent') {
    if (confirm('woman?')) {
      alert('how soon can you move in?');
    }
    else {
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
  for (var i = 0; i < icons.length; i++) {
    icons[i].style.outline = 'none';
  }
  icon.style.outline = '1px dotted blue';
}

async function signUp() {
  var email = document.getElementById('signup-email').value;
  const responseMessage = document.getElementById('signup-response');

  if (confirm("Sign up using this email?\n" + email)) {
    try {
      const response = await fetch('https://api.nate-griffith.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        alert('successfully signed up!');
      }
      else {
        alert('error signing up');
      }
    }
    catch (error) {
      alert('error connecting to service');
      console.error(error);
    }
  }
}

function startVisualization() {
  if (document.getElementById('ms-vis') !== null) {
    document.getElementById('ms-vis').remove();
  }

  const consoleDiv = document.getElementById("vid-bkgd");
  const canvas = document.createElement("canvas");
  canvas.id = 'ms-vis';
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
function stopVisualization() {
  document.getElementById('ms-vis').remove();
}

window.addEventListener('beforeunload', function () {
  windows.forEach(wind => {
    sessionStorage.setItem(`${wind.id}Style`, wind.style.display.toString());
  });
  sessionStorage.setItem('focusedWindow', focusedWindow);
});

window.addEventListener('load', function () {
  const windows = this.document.querySelectorAll('.window');
  if (windows) {
    windows.forEach(wind => {
      if (!wind || wind.id === 'changelog' || wind.id === 'leaderboard') {
        return;
      }
      const windowStyle = sessionStorage.getItem(`${wind.id}Style`);
      if (!windowStyle || windowStyle === null || windowStyle === '') {
        return;
      }
      wind.style.display = windowStyle;
    });
    if (sessionStorage.getItem('focusedWindow') !== '') {
      updateWindowZIndex(sessionStorage.getItem('focusedWindow'));
    }
  }
});

// ----- TEST SUITE -----
// createList('2020s-movies')
// scrollCatalog(6);
// openApp('minesweeper');
// loadHTML('ebay')
// openApp('media-player');
// playMedia('one', 'music');
