// Draws a clickable waveform above each demo clip.
// Progressive enhancement: the <audio> controls work on their own if this never runs.

(function () {
  var WAVEFORMS = window.WAVEFORMS || {}
  var SVG_NS = 'http://www.w3.org/2000/svg'
  var WIDTH = 960
  var HEIGHT = 108

  function formatDuration(seconds) {
    var total = Math.round(seconds)
    var minutes = Math.floor(total / 60)
    var remainder = total % 60
    return minutes + ':' + String(remainder).padStart(2, '0')
  }

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name)
    for (var key in attrs) node.setAttribute(key, attrs[key])
    return node
  }

  function buildWaveform(peaks, isComparison) {
    var svg = el('svg', {
      class: 'waveform' + (isComparison ? ' waveform-comparison' : ''),
      viewBox: '0 0 ' + WIDTH + ' ' + HEIGHT,
      preserveAspectRatio: 'none',
    })
    if (isComparison) {
      svg.setAttribute('role', 'img')
      svg.setAttribute(
        'aria-label',
        'Synchronized stereo comparison waveform. Generated audio is in the left channel and reference audio is in the right channel.'
      )
    } else {
      svg.setAttribute('aria-hidden', 'true')
    }

    svg.appendChild(el('rect', { width: WIDTH, height: HEIGHT, rx: 18, class: 'waveform-bg' }))
    svg.appendChild(el('line', { x1: 0, y1: 54, x2: WIDTH, y2: 54, class: 'waveform-midline' }))

    peaks.forEach(function (peak, index) {
      svg.appendChild(
        el('rect', {
          x: index * 10 + 1.8,
          y: 54 - Math.max(1.6, peak * 48),
          width: 6.4,
          height: Math.max(3.2, peak * 96),
          rx: 3.2,
          class: 'waveform-bar' + (isComparison ? ' waveform-bar-comparison' : ''),
        })
      )
    })

    var progress = el('rect', { width: 0, height: HEIGHT, rx: 18, class: 'waveform-progress-fill' })
    var playhead = el('line', { x1: 0, y1: 9, x2: 0, y2: 99, class: 'waveform-playhead' })
    svg.appendChild(progress)
    svg.appendChild(playhead)

    return { svg: svg, progress: progress, playhead: playhead }
  }

  document.querySelectorAll('.clip-row').forEach(function (row) {
    var audio = row.querySelector('audio')
    if (!audio) return

    var src = audio.getAttribute('src')
    var waveform = WAVEFORMS[src]
    if (!waveform) return

    var duration = waveform.duration
    var label = document.querySelector('[data-duration-for="' + src + '"]')
    if (label) label.textContent = formatDuration(duration)

    var parts = buildWaveform(waveform.peaks, row.classList.contains('comparison-row'))
    row.insertBefore(parts.svg, audio)

    function render(time) {
      var progress = duration > 0 ? Math.min(1, Math.max(0, time / duration)) : 0
      var x = progress * WIDTH
      parts.progress.setAttribute('width', x)
      parts.playhead.setAttribute('x1', x)
      parts.playhead.setAttribute('x2', x)
    }

    function sync() {
      render(audio.currentTime)
    }

    ;['timeupdate', 'seeked', 'loadedmetadata', 'ended'].forEach(function (event) {
      audio.addEventListener(event, sync)
    })

    parts.svg.addEventListener('click', function (event) {
      if (duration <= 0) return
      var rect = parts.svg.getBoundingClientRect()
      var progress = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
      audio.currentTime = progress * duration
      render(audio.currentTime)
    })

    sync()
  })
})()
