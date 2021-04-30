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
    if (!cities) {
      console.warn("Data not loaded yet")
      return
    }

    let query = sanitizeQuery(e.target.value)
    console.log(`sani query: ${query}`)

    if (query.length === 0) {
      suggestions.innerHTML = ""
      return
    }

    const matches = getMatches(query, cities)

    const matchHtml = generateList(matches, query)

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

function sanitizeQuery(query) {
  query = query.replace(/[^a-zA-Z ]/gi, "")
  query = query.trim().toLowerCase()
  query = query.split(" ")

  return query
}

function getMatches(query, data) {
  return data.filter((c) => {
    let matched = []
    for (let i = 0; i < query.length; i++) {
      const regex = new RegExp(query[i], "i")
      if (c.city.match(regex) || c.state.match(regex)) {
        matched[i] = true
      } else matched[i] = false
    }
    return !matched.includes(false)
  })
}

function generateList(matches, query) {
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
    let srcTxt = `${match.city}, ${match.state}`
    let txt = `${match.city}, ${match.state}`.toLowerCase()
    let stack = []
    let lastTxtIndex = 0

    // Highlight matching tokens (with limitations)
    if (txt.indexOf(query[0]) !== 0) {
      stack.push(srcTxt.substr(0, txt.indexOf(query[0])))
      lastTxtIndex = txt.indexOf(query[0])
    }
    console.log(stack)

    query.forEach((q, i) => {
      if (txt.indexOf(q) === -1) {
        console.warn(`query i=${i} not found. shouldn't happen`)
        return
      }

      if (lastTxtIndex !== txt.indexOf(q)) {
        console.log(lastTxtIndex, txt.indexOf(q), txt.indexOf(q) - lastTxtIndex)
        stack.push(srcTxt.substr(lastTxtIndex, txt.indexOf(q) - lastTxtIndex))
      }

      stack.push(`<span class="hl">`)
      stack.push(srcTxt.substr(txt.indexOf(q), q.length))
      stack.push(`</span>`)
      console.log(stack)
      lastTxtIndex = txt.indexOf(q) + q.length
    })

    stack.push(srcTxt.substr(lastTxtIndex))

    const hl = stack.join("")

    return `<li class="suggestion" data-name="${match.city}, ${match.state}">
      <span class="name">${hl}</span>
      <span class="pop">Pop. ${numberWithCommas(match.population)}</span>
    </li>`
  })

  if (overflow) {
    html += `<li class="more">
      <span>(${resultCount - 20} more...)</span>
    </li>`
  }

  return html
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
