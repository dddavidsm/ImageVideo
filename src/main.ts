// main.ts

// 1. Importamos el Web Component (se auto-registra al importar)
import './SuperVideo'

// 2. Importamos la función de nuestra nueva galería
import { inicializarGaleria } from './fotos'

// --- INICIALIZAR VÍDEO ---
const video = document.createElement('super-video')
video.innerHTML = `
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm">
`
// En tu HTML base el <div id="gallery"> está al principio, 
// así que ponemos el vídeo antes de la galería:
const galleryElement = document.querySelector('#gallery') as HTMLDivElement
if (galleryElement && galleryElement.parentNode) {
  galleryElement.parentNode.insertBefore(video, galleryElement)
}

// --- INICIALIZAR FOTOS ---
// Le pasamos el elemento 'gallery' a nuestra función externa para que trabaje ahí
inicializarGaleria(galleryElement)