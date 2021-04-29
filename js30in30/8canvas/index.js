document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")

  ctx.lineWidth = 10
  ctx.lineCap = "round"
  ctx.strokeStyle = `hsl(0, 100%, 50%)`

  let isDrawing = false
  let lastX = 0
  let lastY = 0
  let hue = 0
  let hueDirection = 1

  function draw(e) {
    if (!isDrawing) {
      return
    }

    const newStrokeStyle = `hsl(${hue}, 100%, 50%)`
    console.log(newStrokeStyle)
    ctx.strokeStyle = newStrokeStyle
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.x, e.y)
    ctx.stroke()
    ;[lastX, lastY] = [e.x, e.y]
  }

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true
    lastX = e.x
    lastY = e.y
  })

  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false
  })
  canvas.addEventListener("mouseout", (e) => {
    isDrawing = false
  })

  canvas.addEventListener("mousemove", (e) => {
    if (hue > 360 || hue < 0) {
      hueDirection *= -1
    }
    hue += hueDirection

    draw(e)
  })
})
