// Music player code

let progress = document.getElementById('progress')
let song = document.getElementById('song')
let playBtn = document.getElementById('playBtn')
let leftBtn = document.getElementById('leftBtn')
let moreBtn = document.getElementById('moreBtn')
let songTime = document.getElementById('songTime')
let fileInput = document.getElementById('file-input')
let songTitle = document.getElementById('song-title')
let artistName = document.getElementById('artist-name')

let playTime
let playMinute
let playSecond
let totalTime
let totalMinute
let totalSecond

function PP() {
    if (playBtn.classList.contains('fa-pause')) {
        song.pause()
        playBtn.classList.remove('fa-pause')
        playBtn.classList.add('fa-play')
        animateButton(playBtn)
    } else {
        song.play()
        playBtn.classList.remove('fa-play')
        playBtn.classList.add('fa-pause')
        animateButton(playBtn)
    }
}

function BW(){
  const backwardTime = song.currentTime - 10
  song.currentTime = backwardTime
  progress.value = backwardTime
  animateButton(document.querySelector('.fa-backward'))
  if(song.paused){
    song.play()
    playBtn.classList.remove('fa-play')
    playBtn.classList.add('fa-pause')
  }
}

function FW(){
  const forwardTime = song.currentTime + 10
  song.currentTime = forwardTime
  progress.value = forwardTime
  animateButton(document.querySelector('.fa-forward'))
  if(song.paused){
    song.play()
    playBtn.classList.remove('fa-play')
    playBtn.classList.add('fa-pause')
  }
}

function animateButton(icon) {
  icon.style.transform = 'scale(1.3)'
  setTimeout(() => {
    icon.style.transform = 'scale(1)'
  }, 200)
}

song.addEventListener('timeupdate', updateProgress);

function updateProgress() {
  if (!song.paused) {
    progress.value = song.currentTime;
    updateSongInfo();
  }
}

progress.onchange = function() {
    song.play()
    song.currentTime = progress.value
    playBtn.classList.remove('fa-play')
    playBtn.classList.add('fa-pause')
}

function updateSongInfo() {
    playTime = song.currentTime
    playMinute = Math.floor(playTime / 60)
    playSecond = Math.floor(playTime % 60)
    if (playSecond < 10) {
        playSecond = '0' + playSecond}
    
    totalTime = song.duration
    totalMinute = Math.floor(totalTime / 60)
    totalSecond = Math.floor(totalTime % 60)
    if (totalSecond < 10) {
        totalSecond = '0' + totalSecond}
    
    songTime.style.display = 'block'
    songTime.innerHTML = `Elapsed enjoyment: ${playMinute}:${playSecond} / Total enjoyment: ${totalMinute}:${totalSecond}`
}

// Uploading new file
fileInput.addEventListener('change', e => {
    const file = e.target.files[0]
    if (!file) return

    loadSong(file)
    
    const fileURL = URL.createObjectURL(file)
    song.src = fileURL
    
    songTitle.textContent = file.name.replace(/^\d{1,2}[\.\-)\s]*/, '').replace(/^\d+\.\s*/, "").replace(/\.[^/.]+$/, "") 
    
    song.onloadedmetadata = function() {
        progress.max = song.duration
        progress.value = song.currentTime
        updateSongInfo()
        
        song.play()
        playBtn.classList.remove('fa-play')
        playBtn.classList.add('fa-pause')
    }
})

function loadSong(file) {

    const albumArt = document.getElementById('albumArt')
    const albumName = document.getElementById('albumName')
    const albumYear = document.getElementById('albumYear')

  // Read metadata
  jsmediatags.read(file, {
    onSuccess: function(tag) {

      const aName = tag.tags.album || 'Unknown Album'
      albumName.textContent = `Album: ${aName}`

      const aYear = tag.tags.year || 'Unknown Year'
      albumYear.textContent = `Year: ${aYear}`

      if (tag.tags.picture) {
        const picture = tag.tags.picture
        const base64String = binaryDataToBase64(picture.data)
        const imageUrl = `data:${picture.format};base64,${base64String}`
        albumArt.src = imageUrl
      } else {
        albumArt.src = 'albumart.png'
      }
    },
    onError: function(error) {
      console.error('Error reading metadata:', error)
      albumName.textContent = 'Unknown Album'
      albumArt.src = 'albumart.png'
    }
  })

  // Helper function for image conversion
  function binaryDataToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  
  }
}

function MSG() {
    window.alert('There is nothing to back at the moment :-)')
}

function More() {
    window.alert('No more options at this stage!')
}