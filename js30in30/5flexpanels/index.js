document.addEventListener("DOMContentLoaded", () => {
  const panels = document.querySelectorAll(".panel")
  panels.forEach((el) => {
    console.log(el)

    el.addEventListener("click", (e) => {
      panels.forEach((p) => {
        p.classList.remove("open")
      })
      e.target.classList.add("open")
    })

    el.addEventListener("transitionstart", (e) => {
      if (e.propertyName.includes("flex")) {
        panels.forEach((p) => {
          p.classList.remove("open-active")
        })
      }
    })

    el.addEventListener("transitionend", (e) => {
      console.log(e.target)
      if (e.propertyName.includes("flex")) {
        e.target.classList.add("open-active")
      }
    })
    // el.style.transform = "translate(0)"
  })
})
