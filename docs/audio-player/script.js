import songs from './data/songs.js'

let isPlaying = false

function createElement(tag, className, text) {
  const el = document.createElement(tag)
  if (className) {
    el.className = className
  }
  if (text) {
    el.append(text)
  }
  return el
}

function getPrev(number) {
  if (number - 1 < 0) {
    return songs.length - 1
  }
  return number - 1
}

function getNext(number) {
  if (number + 1 > songs.length - 1) {
    return 0
  }
  return number + 1
}

function showTime(time) {
  const seconds = Math.floor(Math.floor(time) % 60).toString()
  const minutes = Math.floor(time / 60).toString()
  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

function setRange(range, num, song, timeEl) {
  range.max = songs[num].duration
  range.value = 0
  range.step = 0.1
  timeEl.textContent = '00:00'

  song.addEventListener('timeupdate', () => {
    const time = song.currentTime
    if (time) {
      range.value = time
      timeEl.textContent = showTime(time)
    }
  })
}

function getSong(number) {
  const song = new Audio()
  const requestObj = new Request(songs[number].song, {
    method: 'GET',
    headers: {
      'Accept-Ranges': '1000000000',
    },
    referrerPolicy: 'no-referrer',
  })

  fetch(requestObj)
    .then(response => response)
    .then(async function (outcome) {
      const blob = await outcome.blob()
      const url = window.URL.createObjectURL(blob)
      song.src = url
    })

  song.number = number
  return song
}

function togglePlay(isPlayed, audio) {
  if (isPlayed) {
    audio.pause()
  } else {
    audio.play()
  }
}

function changeVolume(song, range, icon) {
  song.muted = false
  song.volume = range.value
  if (range.value > '0.6') {
    icon.className = 'volume-icon volume-3'
  } else if (range.value > '0.3') {
    icon.className = 'volume-icon volume-2'
  } else if (range.value > '0') {
    icon.className = 'volume-icon volume-1'
  } else {
    icon.className = 'volume-icon volume-off'
  }
}

function muteSong(song, icon) {
  song.muted = !song.muted
  icon.classList.toggle('volume-off', song.muted)
}

function muteCheck(song, icon) {
  if (icon.classList.contains('volume-off')) {
    song.muted = true
  }
}

function playSong(song) {
  if (isPlaying) {
    song.play()
  }
}

function createAudioPlayer() {
  const audioPlayer = createElement('div', 'audio-player')
  const controlerContainer = createElement('div', 'control-container')
  const playButton = createElement('button', 'play-button')
  const previousButton = createElement('button', 'previous-button')
  const nextButton = createElement('button', 'next-button')
  const songName = createElement('p', 'song-name')
  const rangeContainer = createElement('div', 'range-container')
  const currentSongTime = createElement('span', 'song-current-time')
  const songRange = createElement('input', 'song-range')
  songRange.type = 'range'
  const songTime = createElement('span', 'total-song-time')
  const volumeContainer = createElement('div', 'volume-container')
  const volumeIcon = createElement('div', 'volume-icon')
  const volumeRange = createElement('input', 'volume-range')
  rangeContainer.append(currentSongTime, songRange, songTime)
  volumeRange.type = 'range'
  volumeRange.step = '0.05'
  volumeRange.value = '0.5'
  volumeRange.max = '1'
  volumeRange.addEventListener('input', () => changeVolume(currentSong, volumeRange, volumeIcon))
  volumeContainer.append(volumeIcon, volumeRange)

  let currentSong = getSong(0)
  volumeIcon.addEventListener('click', () => muteSong(currentSong, volumeIcon))

  function changeSong(number = undefined) {
    currentSong.currentTime = 0
    currentSong.pause()
    if (number !== undefined) {
      currentSong = getSong(number)
    }
    currentSong.addEventListener('ended', () => {
      const number = getNext(currentSong.number)
      changeSong(number)
    })

    document.body.style.backgroundImage = `url(${songs[currentSong.number].cover})`
    setRange(songRange, currentSong.number, currentSong, currentSongTime)
    songTime.textContent = showTime(songs[currentSong.number].duration)
    currentSong.volume = volumeRange.value
    changeVolume(currentSong, volumeRange, volumeIcon)
    songName.textContent = `${songs[currentSong.number].artist}: ${songs[currentSong.number].name}`
    muteCheck(currentSong, volumeIcon)
    playSong(currentSong)
  }

  songRange.addEventListener('input', () => {
    const src = currentSong.src
    currentSong.src = ''
    currentSong.src = src
    const onLoad = () => {
      currentSong.removeEventListener('loadedmetadata', onLoad)
      currentSong.currentTime = parseInt(songRange.value)
      playSong(currentSong)
    }
    currentSong.addEventListener('loadedmetadata', onLoad)
  })

  playButton.addEventListener('click', () => {
    togglePlay(isPlaying, currentSong)
    isPlaying = !isPlaying
    playButton.classList.toggle('paused')
  })

  previousButton.addEventListener('click', () => {
    const number = getPrev(currentSong.number)
    changeSong(number)
  })

  nextButton.addEventListener('click', () => {
    const number = getNext(currentSong.number)
    changeSong(number)
  })

  controlerContainer.append(previousButton, playButton, nextButton)
  audioPlayer.append(songName, rangeContainer, controlerContainer, volumeContainer)

  changeSong()

  return audioPlayer
}

const main = document.querySelector('main')
main.append(createAudioPlayer())
