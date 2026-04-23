// Archivo: src/SuperVideo.ts

class SuperVideo extends HTMLElement {
  connectedCallback(): void {
    if (this.shadowRoot) return

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        .player { max-width: 800px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; }
        video { width: 100%; display: block; background: #000; }
        .controls { display: flex; gap: 8px; align-items: center; padding: 8px; background: #f3f3f3; }
        .progress { flex: 1; cursor: pointer; }
        .time { font-family: monospace; }
      </style>
      <div class="player">
        <video></video>
        <div class="controls">
          <button class="play" type="button">Play</button>
          <button class="back" type="button">-10s</button>
          <button class="forward" type="button">+10s</button>
          <input class="progress" type="range" min="0" max="100" value="0">
          <span class="time">00:00 / 00:00</span>
          <button class="fullscreen" type="button">Fullscreen</button>
        </div>
      </div>
    `

    const video = shadow.querySelector('video') as HTMLVideoElement
    const playBtn = shadow.querySelector('.play') as HTMLButtonElement
    const backBtn = shadow.querySelector('.back') as HTMLButtonElement
    const forwardBtn = shadow.querySelector('.forward') as HTMLButtonElement
    const time = shadow.querySelector('.time') as HTMLSpanElement
    const fullscreen = shadow.querySelector('.fullscreen') as HTMLButtonElement
    const player = shadow.querySelector('.player') as HTMLDivElement
    const progressBar = shadow.querySelector('.progress') as HTMLInputElement

    for (const node of this.querySelectorAll('source, track')) {
      video.appendChild(node.cloneNode(true))
    }

    video.preload = 'metadata'

    const format = (seconds: number): string => {
      if (!Number.isFinite(seconds)) return '00:00'
      const min = Math.floor(seconds / 60)
      const sec = Math.floor(seconds % 60)
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    }

    const updateTime = (): void => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
      const percent = duration > 0 ? (video.currentTime / duration) * 100 : 0
      progressBar.value = percent.toString()
      time.textContent = `${format(video.currentTime)} / ${format(video.duration)}`
      playBtn.textContent = video.paused ? 'Play' : 'Pause'
    }

    playBtn.addEventListener('click', () => {
      if (video.paused) {
        void video.play()
      } else {
        video.pause()
      }
    })

    backBtn.addEventListener('click', () => {
      video.currentTime = Math.max(0, video.currentTime - 10)
    })

    forwardBtn.addEventListener('click', () => {
      const end = Number.isFinite(video.duration) ? video.duration : video.currentTime + 10
      video.currentTime = Math.min(end, video.currentTime + 10)
    })

    fullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        void player.requestFullscreen()
      } else {
        void document.exitFullscreen()
      }
    })

    // Aquí está la barra de progreso optimizada usando solo el evento 'input'
    progressBar.addEventListener('input', () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      video.currentTime = (Number(progressBar.value) / 100) * video.duration
    })

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateTime)
    video.addEventListener('play', updateTime)
    video.addEventListener('pause', updateTime)

    updateTime()
  }
}

if (!customElements.get('super-video')) {
  customElements.define('super-video', SuperVideo)
}