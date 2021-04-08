window.addEventListener("DOMContentLoaded", (e) => {
  function playClip(key) {
    const audioTag = document.querySelector(`audio[data-key=${key}]`)
    if (!audioTag) {
      return null
    }

    audioTag.pause()
    audioTag.currentTime = 0.0
    audioTag.play()
  }

  document.querySelectorAll(".key").forEach((el, i) => {
    el.addEventListener("click", (e) => {
      const keyHit = e.target.dataset.key
      playClip(keyHit)
    })
  })
  document.addEventListener("keydown", (e) => {
    const keyHit = e.key.toUpperCase()
    playClip(keyHit)
  })
  document.addEventListener("touchstart", (e) => {
    const keyHit = e.key.toUpperCase()
    playClip(keyHit)
  })
})
