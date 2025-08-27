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
const canvas = document.getElementById('visualizer')
const ctx = canvas.getContext('2d')
let audioContext
let analyser
let dataArray

let playTime
let playMinute
let playSecond
let totalTime
let totalMinute
let totalSecond


function initVisualizer() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256
  
  const source = audioContext.createMediaElementSource(song)
  source.connect(analyser)
  analyser.connect(audioContext.destination)
  
  dataArray = new Uint8Array(analyser.frequencyBinCount)
  
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  
  if (!song.paused) visualize()
}

function visualize() {
  if (!analyser) return
  
  requestAnimationFrame(visualize)
  
  analyser.getByteFrequencyData(dataArray)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const barWidth = (canvas.width / dataArray.length) * 3
  let x = 0;
  
  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i] / 1.2
    
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight)
    gradient.addColorStop(0, '#00b4db')
    gradient.addColorStop(1, '#0083b0')
    
    ctx.fillStyle = gradient
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
    
    x += barWidth + 3
  }
}


function PP() {
    if (playBtn.classList.contains('fa-pause')) {
        song.pause()
        playBtn.classList.remove('fa-pause')
        playBtn.classList.add('fa-play')
        animateButton(playBtn)
    } else {
        song.play()
        if (!audioContext) initVisualizer()
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

progress.oninput = function() {
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

    loadMetaData(file)
    
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

function loadMetaData(file) {

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

window.addEventListener('resize', () => {
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
})

song.onplay = function() {
  if (!audioContext) initVisualizer()
}

song.addEventListener('ended', function(){
  song.currentTime = 0
  progress.value = 0
  updateSongInfo()
  song.play()
})

function MSG() {
    window.alert('There is nothing to back at the moment :-)')
}

function More() {
    window.alert('No more options at this stage!')
}