window.addEventListener("DOMContentLoaded", (e) => {
  function playClip(key) {
    const audioTag = document.querySelector(`audio[data-key=${key}]`)
    if (!audioTag) {
      return null
    }

    const domTarget = document.querySelector(`.key[data-key=${key}]`)
    domTarget.classList.add("playing")

    audioTag.currentTime = 0.0
    audioTag.play()
  }

  // Initialize DOM events
  document.querySelectorAll(".key").forEach((el) => {
    el.addEventListener("click", (e) => {
      const keyHit = e.target.dataset.key
      playClip(keyHit)
    })
    el.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "transform") {
        return
      }

      e.target.classList.remove("playing")
    })
  })

  // Keyboard events
  document.addEventListener("keydown", (e) => {
    const keyHit = e.key.toUpperCase()
    playClip(keyHit)
  })

  // Touch events
  document.addEventListener("touchstart", (e) => {
    const keyHit = e.key.toUpperCase()
    playClip(keyHit)
  })
})
