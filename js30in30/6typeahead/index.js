const apiUri =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
const fetchPromise = fetch(apiUri)
let cities = []

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".query")
  const form = document.querySelector(".search-form")

  fetchPromise
    .then((response) => response.json())
    .then((data) => {
      input.placeholder = "City or State"
      cities = data
    })

  input.addEventListener("input", (e) => {
    console.log(e)
    if (!cities) {
      console.warn("Data not loaded yet")
      return
    }

    const query = e.target.value
    const matches = getMatches(query, cities)
    console.log(`query: ${query} matches`, matches)
    const matchHtml = generateList(matches)
    document.querySelector(".suggestions").innerHTML = matchHtml
  })
})

function getMatches(query, data) {
  query = query.replace(/[^a-zA-Z ]/gi, "")
  query = query.trim()
  if (query === "") {
    return []
  }

  let queries = query.split(" ")
  console.log(queries)

  return data.filter((c) => {
    let matched = []
    for (let i = 0; i < queries.length; i++) {
      const regex = new RegExp(queries[i], "i")
      if (c.city.match(regex) || c.state.match(regex)) {
        matched[i] = true
      } else matched[i] = false
    }
    return !matched.includes(false)
  })
}

function generateList(matches) {
  let overflow = false
  let resultCount = matches.length

  if (matches.length > 20) {
    matches = matches.slice(0, 19)
    overflow = true
  }
  let html = matches.map((match) => {
    return `
    <li class="suggestion">
      <span class="name">${match.city}, ${match.state}</span>
      <span class="pop">${match.population}</span>
      <span class="map">
        <a href="https://www.google.com/maps?q=${match.latitude},${match.longitude}">Map</a>
      </span>
    </li>
  `
  })

  if (overflow) {
    html += `
    <li class="more">
      <span>(${resultCount - 20} more...)</span>
    </li>
  `
  }

  return html
}

// https://www.freecodecamp.org/news/javascript-debounce-example/
function debounce_leading(func, timeout = 300) {
  let timer
  return (...args) => {
    if (!timer) {
      func.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
    }, timeout)
  }
}
