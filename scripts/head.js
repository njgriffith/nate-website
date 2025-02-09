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
function loadFolderContents(type) {
  try {
    if (type === 'music') {
      const mediaContent = songList;
      mediaTableBody.innerHTML = '';

      mediaContent.forEach((item, index) => {
        const itemDiv = document.createElement('tr');
        const title = document.createElement('td');
        const length = document.createElement('td');
        const artist = document.createElement('td');

        var songKey = Object.keys(item)[0];
        title.textContent = songKey;
        artist.textContent = item[songKey];
        length.textContent = '1:23';

        itemDiv.appendChild(title);
        itemDiv.appendChild(artist);
        itemDiv.appendChild(length);

        itemDiv.style.cursor = "pointer";
        itemDiv.addEventListener('click', () => handleMediaEvent('play', index));

        mediaTableBody.appendChild(itemDiv);
      });
    }
    else if (type === 'background') {
      const settings = document.getElementById('settings').querySelector('.window-body');
      if (settings.innerHTML !== '') {
        return;
      }
      const mediaContent = backgroundList;
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
    console.error('Folder not found ', error);
  }
}

audioPlayer.addEventListener('ended', event => {
  currentSongIndex++;
  if (currentSongIndex === songList.length) {
    currentSongIndex = 0;
  }
  handleMediaEvent('play');
});

audioPlayer.addEventListener('timeupdate', (event) => {
  if (isDraggingMediaTime) {
    return;
  }
  document.getElementById('player-current-time').style.left = `${(160 * audioPlayer.currentTime) / audioPlayer.duration}px`;
  timeElapsed = event.timeStamp;
});
var isMediaPaused = true;
function handleMediaEvent(action, songIndex = currentSongIndex) {
  if (action === 'play') {
    if (!isMediaPaused || !audioPlayer.hasAttribute('src') || songIndex != currentSongIndex) {
      audioPlayer.src = `/resources/music/${Object.keys(songList[songIndex])}.mp3`;
    }
    isMediaPaused = false;
    currentSongIndex = songIndex;
    const rows = mediaTableBody.querySelectorAll('tr');
    rows.forEach(row => {
      row.classList.remove('playing');
    });
    rows[currentSongIndex].classList.add('playing');
    audioPlayer.play();
    startVisualization();
    handleLeftEar(songIndex);
  }
  else if (action === 'pause') {
    isMediaPaused = true;
    audioPlayer.pause();
    stopVisualization();
  }
  else if (action === 'prev') {
    isMediaPaused = false;
    currentSongIndex--;
    if (currentSongIndex === -1) {
      currentSongIndex = songList.length - 1;
    }
    handleMediaEvent('play', currentSongIndex);
  }
  else if (action === 'next') {
    isMediaPaused = false;
    currentSongIndex++;
    handleMediaEvent('play', currentSongIndex % songList.length);
  }
}

function handleLeftEar(songIndex) {
  document.getElementById('player-song').innerText = Object.keys(songList[songIndex])[0];
  document.getElementById('player-artist').innerText = Object.values(songList[songIndex])[0]
}
