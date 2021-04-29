const apiUri =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
const fetchPromise = fetch(apiUri)
let cities = []

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".query")
  const form = document.querySelector(".search-form")
  const suggestions = document.querySelector(".suggestions")

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

    let query = e.target.value
    console.log(`query: ${query} matches`)
    query = query.replace(/[^a-zA-Z ]/gi, "")
    query = query.trim()

    if (query === "") {
      return
    }

    const matches = getMatches(query, cities)

    const matchHtml = generateList(matches)

    suggestions.innerHTML = matchHtml
    document.querySelectorAll(".suggestion").forEach((el) => {
      el.addEventListener("click", handleSelection)
    })
  })

  function handleSelection(e) {
    input.value = e.target.dataset.name
    suggestions.innerHTML = ""
    input.focus()
  }
})

function getMatches(query, data) {
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

  if (matches.length === 0) {
    return `<li class="more">
      <span>No results</span>
    </li>`
  }

  if (resultCount > 20) {
    matches = matches.slice(0, 19)
    overflow = true
  }

  let html = matches.map((match) => {
    return `<li class="suggestion" data-name="${match.city}, ${match.state}">
      <span class="name">${match.city}, ${match.state}</span>
      <span class="map">
        <a href="https://www.google.com/maps?q=${match.latitude},${match.longitude}">Map</a>
      </span>
      <span class="pop">Pop. ${match.population}</span>
    </li>`
  })

  if (overflow) {
    html += `<li class="more">
      <span>(${resultCount - 20} more...)</span>
    </li>`
  }

  return html
}
