// fotos.ts

// Exportamos la función para poder usarla desde fuera
export function inicializarGaleria(galleryContainer: HTMLDivElement | null) {
  if (!galleryContainer) return

  const images = ['imagen_perro.png', 'imagen_convertida.jpg', 'imagen_convertida.webp']

  const createCell = (text: string): HTMLTableCellElement => {
    const td = document.createElement('td')
    td.textContent = text
    return td
  }

  const orientation = (w: number, h: number): string => {
    if (w > h) return 'Landscape'
    if (w < h) return 'Portrait'
    return 'Square'
  }

  for (const name of images) {
    const card = document.createElement('div')
    card.className = 'card'

    const img = document.createElement('img')
    const table = document.createElement('table')
    const body = document.createElement('tbody')

    img.src = `/${name}`
    img.width = 280
    img.alt = name

    const rowName = document.createElement('tr')
    rowName.append(createCell('Fitxer'), createCell(name))

    const rowDim = document.createElement('tr')
    rowDim.append(createCell('Dimensions'), createCell('...'))

    const rowOri = document.createElement('tr')
    rowOri.append(createCell('Orientació'), createCell('...'))

    const rowTime = document.createElement('tr')
    rowTime.append(createCell('Temps càrrega'), createCell('...'))

    const rowSize = document.createElement('tr')
    rowSize.append(createCell('Mida'), createCell('...'))

    const rowType = document.createElement('tr')
    rowType.append(createCell('Tipus'), createCell('...'))

    body.append(rowName, rowDim, rowOri, rowTime, rowSize, rowType)
    table.appendChild(body)

    const dimValue = rowDim.children[1] as HTMLTableCellElement
    const oriValue = rowOri.children[1] as HTMLTableCellElement
    const timeValue = rowTime.children[1] as HTMLTableCellElement
    const sizeValue = rowSize.children[1] as HTMLTableCellElement
    const typeValue = rowType.children[1] as HTMLTableCellElement

    img.addEventListener('load', async () => {
      dimValue.textContent = `${img.naturalWidth} x ${img.naturalHeight} px`
      oriValue.textContent = orientation(img.naturalWidth, img.naturalHeight)

      const entries = performance.getEntriesByName(img.src) as PerformanceResourceTiming[]
      const entry = entries.at(-1)
      timeValue.textContent = entry ? `${entry.duration.toFixed(2)} ms` : '—'

      try {
        const res = await fetch(img.src, { method: 'HEAD' })
        const bytes = Number(res.headers.get('Content-Length'))
        const mime = res.headers.get('Content-Type') ?? '—'

        sizeValue.textContent = bytes ? `${(bytes / 1024).toFixed(1)} KB` : '—'
        typeValue.textContent = mime.split(';')[0]
      } catch {
        sizeValue.textContent = 'Error'
        typeValue.textContent = 'Error'
      }
    })

    card.append(img, table)
    galleryContainer.appendChild(card)
  }
}